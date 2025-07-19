import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const getDashboardStats = query({
  args: {},
  returns: v.object({
    totalUsers: v.number(),
    newUsersToday: v.number(),
    totalMatches: v.number(),
    activeMatches: v.number(),
    totalRevenue: v.number(),
    totalTransactions: v.number(),
    pendingVerifications: v.number(),
    pendingDeposits: v.number(),
    pendingWithdrawals: v.number(),
    openTickets: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const [
      allUsers,
      allMatches,
      allTransactions,
      pendingVerifications,
      pendingDeposits,
      pendingWithdrawals,
      openTickets
    ] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("matches").collect(),
      ctx.db.query("transactions").collect(),
      ctx.db.query("verificationRequests")
        .filter(q => q.eq(q.field("status"), "pending"))
        .collect(),
      ctx.db.query("transactions")
        .filter(q => q.and(
          q.eq(q.field("type"), "deposit"),
          q.eq(q.field("status"), "pending")
        ))
        .collect(),
      ctx.db.query("transactions")
        .filter(q => q.and(
          q.eq(q.field("type"), "withdrawal"),
          q.eq(q.field("status"), "pending")
        ))
        .collect(),
      ctx.db.query("supportTickets")
        .filter(q => q.eq(q.field("status"), "open"))
        .collect()
    ]);

    const newUsersToday = allUsers.filter(user => user._creationTime >= todayTimestamp).length;
    const activeMatches = allMatches.filter(match => match.status === "live" || match.status === "open").length;
    const totalRevenue = allTransactions
      .filter(t => t.type === "match_entry" && t.status === "approved")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers: allUsers.length,
      newUsersToday,
      totalMatches: allMatches.length,
      activeMatches,
      totalRevenue,
      totalTransactions: allTransactions.length,
      pendingVerifications: pendingVerifications.length,
      pendingDeposits: pendingDeposits.length,
      pendingWithdrawals: pendingWithdrawals.length,
      openTickets: openTickets.length,
    };
  },
});

export const getAllUsers = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db.query("users").collect();
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("member")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    
    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.userId, { role: args.role });
    return null;
  },
});

export const updateUserVerification = mutation({
  args: {
    userId: v.id("users"),
    verificationLevel: v.union(
      v.literal("pending_email"),
      v.literal("unverified"),
      v.literal("player"),
      v.literal("host")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    
    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.userId, { verificationLevel: args.verificationLevel });
    return null;
  },
});

export const getVerificationQueue = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const requests = await ctx.db
      .query("verificationRequests")
      .filter(q => q.eq(q.field("status"), "pending"))
      .collect();

    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const user = await ctx.db.get(request.userId);
        return {
          ...request,
          user: user ? { name: user.name, email: user.email } : null,
        };
      })
    );

    return requestsWithUsers;
  },
});

export const approveVerification = mutation({
  args: {
    requestId: v.id("verificationRequests"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    
    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");

    await ctx.db.patch(args.requestId, { status: "approved" });
    await ctx.db.patch(request.userId, { verificationLevel: request.level });
    
    return null;
  },
});

export const rejectVerification = mutation({
  args: {
    requestId: v.id("verificationRequests"),
    reason: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    
    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.requestId, { 
      status: "rejected",
      rejectionReason: args.reason 
    });
    
    return null;
  },
});

export const getPendingTransactions = query({
  args: {
    type: v.optional(v.union(v.literal("deposit"), v.literal("withdrawal"))),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    let query = ctx.db
      .query("transactions")
      .filter(q => q.eq(q.field("status"), "pending"));

    if (args.type) {
      query = query.filter(q => q.eq(q.field("type"), args.type));
    }

    const transactions = await query.collect();

    const transactionsWithUsers = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await ctx.db.get(transaction.userId);
        return {
          ...transaction,
          user: user ? { name: user.name, email: user.email } : null,
        };
      })
    );

    return transactionsWithUsers;
  },
});

export const approveTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    adminNotes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    
    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) throw new Error("Transaction not found");

    await ctx.db.patch(args.transactionId, { 
      status: "approved",
      adminNotes: args.adminNotes 
    });

    // Update user wallet balance for deposits
    if (transaction.type === "deposit") {
      const user = await ctx.db.get(transaction.userId);
      if (user) {
        const newBalance = (user.walletBalance || 0) + transaction.amount;
        await ctx.db.patch(transaction.userId, { walletBalance: newBalance });
      }
    }
    
    return null;
  },
});

export const rejectTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    reason: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    
    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.transactionId, { 
      status: "rejected",
      adminNotes: args.reason 
    });
    
    return null;
  },
});

export const getAllSupportTickets = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const tickets = await ctx.db.query("supportTickets").collect();

    const ticketsWithUsers = await Promise.all(
      tickets.map(async (ticket) => {
        const user = ticket.userId ? await ctx.db.get(ticket.userId) : null;
        return {
          ...ticket,
          user: user ? { name: user.name } : undefined,
        };
      })
    );

    return ticketsWithUsers;
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
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");
    
    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    const updateData: any = { status: args.status };
    if (args.adminResponse) {
      updateData.adminResponse = args.adminResponse;
    }

    await ctx.db.patch(args.ticketId, updateData);
    return null;
  },
});