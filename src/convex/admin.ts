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
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (args.approved) {
      // Approve transaction
      await ctx.db.patch(args.transactionId, {
        status: "approved",
        adminNotes: args.adminNotes,
      });

      // If it's a deposit, add money to user wallet
      if (transaction.type === "deposit") {
        const transactionUser = await ctx.db.get(transaction.userId);
        if (transactionUser) {
          await ctx.db.patch(transaction.userId, {
            walletBalance: (transactionUser.walletBalance || 0) + transaction.amount,
          });
        }
      }
    } else {
      // Reject transaction
      await ctx.db.patch(args.transactionId, {
        status: "rejected",
        adminNotes: args.adminNotes,
      });

      // If it's a withdrawal that was rejected, refund the money
      if (transaction.type === "withdrawal") {
        const transactionUser = await ctx.db.get(transaction.userId);
        if (transactionUser) {
          await ctx.db.patch(transaction.userId, {
            walletBalance: (transactionUser.walletBalance || 0) + transaction.amount,
          });
        }
      }
    }

    return null;
  },
});

export const getPendingTransactions = query({
  args: {
    type: v.optional(v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("match_entry"),
      v.literal("match_payout"),
      v.literal("refund")
    )),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    let query = ctx.db
      .query("transactions")
      .withIndex("by_status", (q) => q.eq("status", "pending"));

    const transactions = await query.collect();

    if (args.type) {
      return transactions.filter(t => t.type === args.type);
    }

    return transactions;
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

export const getDashboardStats = query({
  args: {},
  returns: v.object({
    totalUsers: v.number(),
    totalMatches: v.number(),
    totalTransactions: v.number(),
    pendingTransactions: v.number(),
    totalRevenue: v.number(),
    newUsersToday: v.number(),
    activeMatches: v.number(),
    pendingVerifications: v.number(),
    pendingDeposits: v.number(),
    pendingWithdrawals: v.number(),
    openTickets: v.number(),
  }),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const [users, matches, transactions, verificationRequests, supportTickets] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("matches").collect(),
      ctx.db.query("transactions").collect(),
      ctx.db.query("verificationRequests").collect(),
      ctx.db.query("supportTickets").collect(),
    ]);

    // Calculate today's date for new users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const newUsersToday = users.filter(u => u._creationTime >= todayTimestamp).length;
    const activeMatches = matches.filter(m => m.status === "live" || m.status === "open").length;
    const pendingTransactions = transactions.filter(t => t.status === "pending").length;
    const pendingDeposits = transactions.filter(t => t.status === "pending" && t.type === "deposit").length;
    const pendingWithdrawals = transactions.filter(t => t.status === "pending" && t.type === "withdrawal").length;
    const pendingVerifications = verificationRequests.filter(v => v.status === "pending").length;
    const openTickets = supportTickets.filter(t => t.status === "open").length;
    
    const totalRevenue = transactions
      .filter(t => t.status === "approved" && t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers: users.length,
      totalMatches: matches.length,
      totalTransactions: transactions.length,
      pendingTransactions,
      totalRevenue,
      newUsersToday,
      activeMatches,
      pendingVerifications,
      pendingDeposits,
      pendingWithdrawals,
      openTickets,
    };
  },
});

export const getAllUsers = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db.query("users").collect();
  },
});

export const getAllSupportTickets = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db.query("supportTickets").collect();
  },
});

export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("closed")),
    adminResponse: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.ticketId, {
      status: args.status,
      adminResponse: args.adminResponse,
    });

    return null;
  },
});

export const rejectTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    adminNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // If it's a withdrawal that was rejected, refund the money
    if (transaction.type === "withdrawal" && transaction.status === "pending") {
      const transactionUser = await ctx.db.get(transaction.userId);
      if (transactionUser) {
        await ctx.db.patch(transaction.userId, {
          walletBalance: (transactionUser.walletBalance || 0) + transaction.amount,
        });
      }
    }

    await ctx.db.patch(args.transactionId, {
      status: "rejected",
      adminNotes: args.adminNotes,
    });

    return null;
  },
});

export const getVerificationQueue = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db
      .query("verificationRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

export const approveVerification = mutation({
  args: {
    requestId: v.id("verificationRequests"),
    adminNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Verification request not found");
    }

    // Update verification request
    await ctx.db.patch(args.requestId, {
      status: "approved",
      rejectionReason: args.adminNotes,
    });

    // Update user verification level
    await ctx.db.patch(request.userId, {
      verificationLevel: request.level,
    });

    return null;
  },
});

export const rejectVerification = mutation({
  args: {
    requestId: v.id("verificationRequests"),
    rejectionReason: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.requestId, {
      status: "rejected",
      rejectionReason: args.rejectionReason,
    });

    return null;
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("member")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
    });

    return null;
  },
});