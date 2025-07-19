import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTicket = mutation({
  args: {
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    matchId: v.optional(v.id("matches")),
    attachments: v.optional(v.array(v.string())),
  },
  returns: v.id("supportTickets"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const ticketData = {
      userId: userId || undefined,
      email: args.email,
      subject: args.subject,
      message: args.message,
      status: "open" as const,
      matchId: args.matchId,
      attachments: args.attachments,
    };

    return await ctx.db.insert("supportTickets", ticketData);
  },
});

export const getUserTickets = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("supportTickets")
      .filter(q => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
  },
});