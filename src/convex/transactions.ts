import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createDeposit = mutation({
  args: {
    amount: v.number(),
    utrId: v.string(),
    paymentScreenshot: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (args.amount < 10) {
      throw new Error("Minimum deposit amount is ₹10");
    }

    if (args.amount > 100000) {
      throw new Error("Maximum deposit amount is ₹1,00,000");
    }

    // Generate unique amount for verification
    const uniqueAmount = args.amount + (Math.random() * 0.99);

    await ctx.db.insert("transactions", {
      userId,
      type: "deposit",
      amount: args.amount,
      status: "pending",
      utrId: args.utrId,
      paymentScreenshot: args.paymentScreenshot,
      uniqueAmount,
    });

    return null;
  },
});

export const createWithdrawal = mutation({
  args: {
    amount: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (args.amount < 100) {
      throw new Error("Minimum withdrawal amount is ₹100");
    }

    if ((user.walletBalance || 0) < args.amount) {
      throw new Error("Insufficient wallet balance");
    }

    // Deduct amount from wallet immediately
    await ctx.db.patch(userId, {
      walletBalance: (user.walletBalance || 0) - args.amount,
    });

    await ctx.db.insert("transactions", {
      userId,
      type: "withdrawal",
      amount: args.amount,
      status: "pending",
    });

    return null;
  },
});

export const getUserTransactions = query({
  args: {},
  returns: v.array(v.any()),
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

export const getUser = internalQuery({
  args: { userId: v.id("users") },
  returns: v.union(v.null(), v.any()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const storePaymentOrder = internalMutation({
  args: {
    orderId: v.string(),
    userId: v.id("users"),
    amount: v.number(),
    paymentSessionId: v.string(),
    status: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "deposit",
      amount: args.amount,
      status: "pending",
      utrId: args.orderId,
      adminNotes: `Cashfree Order: ${args.orderId}, Session: ${args.paymentSessionId}`,
    });
    return null;
  },
});

export const processSuccessfulPayment = internalMutation({
  args: {
    orderId: v.string(),
    amount: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find the transaction
    const transaction = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("utrId"), args.orderId))
      .first();

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Update transaction status
    await ctx.db.patch(transaction._id, {
      status: "approved",
      adminNotes: `${transaction.adminNotes} - Payment verified and approved automatically`,
    });

    // Add money to user wallet
    const user = await ctx.db.get(transaction.userId);
    if (user) {
      await ctx.db.patch(user._id, {
        walletBalance: (user.walletBalance || 0) + args.amount,
      });
    }

    return null;
  },
});

export const processFailedPayment = internalMutation({
  args: {
    orderId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find the transaction
    const transaction = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("utrId"), args.orderId))
      .first();

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Update transaction status
    await ctx.db.patch(transaction._id, {
      status: "rejected",
      adminNotes: `${transaction.adminNotes} - Payment failed`,
    });

    return null;
  },
});