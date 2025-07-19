import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const approveTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    approved: v.boolean(),
    adminNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "pending") {
      throw new Error("Transaction is not pending approval");
    }

    const newStatus = args.approved ? "approved" : "rejected";
    
    await ctx.db.patch(args.transactionId, {
      status: newStatus,
      adminNotes: args.adminNotes || `${newStatus} by admin`,
    });

    // If deposit approved, add to wallet
    if (args.approved && transaction.type === "deposit") {
      const user = await ctx.db.get(transaction.userId);
      if (user) {
        await ctx.db.patch(user._id, {
          walletBalance: (user.walletBalance || 0) + transaction.amount,
        });
      }
    }

    // If withdrawal rejected, refund to wallet
    if (!args.approved && transaction.type === "withdrawal") {
      const user = await ctx.db.get(transaction.userId);
      if (user) {
        await ctx.db.patch(user._id, {
          walletBalance: (user.walletBalance || 0) + transaction.amount,
        });
      }
    }

    return null;
  },
});

export const getPendingTransactions = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const admin = await getCurrentUser(ctx);
    
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db
      .query("transactions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(50);
  },
});

export const updateUserVerification = mutation({
  args: {
    userId: v.id("users"),
    verificationLevel: v.union(
      v.literal("unverified"),
      v.literal("player"),
      v.literal("host")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.userId, {
      verificationLevel: args.verificationLevel,
    });

    return null;
  },
});