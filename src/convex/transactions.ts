import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createDeposit = mutation({
  args: {
    amount: v.number(),
    utrId: v.string(),
    paymentScreenshot: v.string(),
  },
  returns: v.id("transactions"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Generate unique amount for verification
    const uniqueAmount = args.amount + (Math.random() * 0.99);

    return await ctx.db.insert("transactions", {
      userId,
      type: "deposit",
      amount: args.amount,
      status: "pending",
      utrId: args.utrId,
      paymentScreenshot: args.paymentScreenshot,
      uniqueAmount,
    });
  },
});

export const createWithdrawal = mutation({
  args: {
    amount: v.number(),
  },
  returns: v.id("transactions"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if ((user.walletBalance || 0) < args.amount) {
      throw new Error("Insufficient balance");
    }

    return await ctx.db.insert("transactions", {
      userId,
      type: "withdrawal",
      amount: args.amount,
      status: "pending",
    });
  },
});

export const getUserTransactions = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("transactions"),
    _creationTime: v.number(),
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("match_entry"),
      v.literal("match_payout"),
      v.literal("refund")
    ),
    amount: v.number(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    matchId: v.optional(v.id("matches")),
    utrId: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});
