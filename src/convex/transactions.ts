import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getCurrentUser } from "./users";

export const createDeposit = mutation({
  args: {
    amount: v.number(),
    utrId: v.string(),
    paymentScreenshot: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Server-side validation
    if (!Number.isInteger(args.amount) || args.amount < 10) {
      throw new Error("Minimum deposit amount is ₹10");
    }

    if (args.amount > 100000) {
      throw new Error("Maximum deposit amount is ₹1,00,000");
    }

    // Validate UTR ID format
    if (!args.utrId.trim() || args.utrId.length < 6 || args.utrId.length > 20) {
      throw new Error("Invalid UTR ID format");
    }

    // Check for duplicate UTR ID
    const existingTransaction = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("utrId"), args.utrId))
      .first();

    if (existingTransaction) {
      throw new Error("UTR ID already used");
    }

    // Generate unique amount for verification
    const uniqueAmount = args.amount + (Math.random() * 0.99);

    await ctx.db.insert("transactions", {
      userId: user._id,
      type: "deposit",
      amount: args.amount,
      status: "pending",
      utrId: args.utrId.trim(),
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
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Server-side validation
    if (!Number.isInteger(args.amount) || args.amount < 100) {
      throw new Error("Minimum withdrawal amount is ₹100");
    }

    if (args.amount > 50000) {
      throw new Error("Maximum withdrawal amount is ₹50,000 per transaction");
    }

    const currentBalance = user.walletBalance || 0;
    if (currentBalance < args.amount) {
      throw new Error(`Insufficient balance. Available: ₹${currentBalance}`);
    }

    // Check for pending withdrawals
    const pendingWithdrawals = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.and(
        q.eq(q.field("type"), "withdrawal"),
        q.eq(q.field("status"), "pending")
      ))
      .collect();

    if (pendingWithdrawals.length > 0) {
      throw new Error("You have a pending withdrawal. Please wait for it to be processed.");
    }

    // Deduct amount from wallet immediately
    await ctx.db.patch(user._id, {
      walletBalance: currentBalance - args.amount,
    });

    await ctx.db.insert("transactions", {
      userId: user._id,
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