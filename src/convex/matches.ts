import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    gameId: v.id("games"),
    title: v.string(),
    entryFee: v.number(),
    startTime: v.number(),
    streamUrl: v.string(),
  },
  returns: v.id("matches"),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (user.verificationLevel !== "host") {
      throw new Error("Only hosts can create matches");
    }

    return await ctx.db.insert("matches", {
      hostId: user._id,
      gameId: args.gameId,
      title: args.title,
      entryFee: args.entryFee,
      startTime: args.startTime,
      streamUrl: args.streamUrl,
      status: "open",
    });
  },
});

export const listOpen = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("matches"),
    _creationTime: v.number(),
    hostId: v.id("users"),
    gameId: v.id("games"),
    title: v.string(),
    entryFee: v.number(),
    startTime: v.number(),
    streamUrl: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("live"),
      v.literal("completed"),
      v.literal("disputed"),
      v.literal("cancelled")
    ),
    winnerId: v.optional(v.id("users")),
    player1Id: v.optional(v.id("users")),
    player2Id: v.optional(v.id("users")),
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .order("desc")
      .take(50);
  },
});

export const getByUser = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const matches = await ctx.db
      .query("matches")
      .filter((q) => q.or(
        q.eq(q.field("hostId"), userId),
        q.eq(q.field("player1Id"), userId),
        q.eq(q.field("player2Id"), userId)
      ))
      .collect();

    return matches;
  },
});

export const declareWinner = mutation({
  args: {
    matchId: v.id("matches"),
    winnerId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const match = await ctx.db.get(args.matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    // Only the host can declare winner
    if (match.hostId !== userId) {
      throw new Error("Only the host can declare the winner");
    }

    // Match must be live
    if (match.status !== "live") {
      throw new Error("Can only declare winner for live matches");
    }

    // Winner must be one of the players
    if (args.winnerId !== match.player1Id && args.winnerId !== match.player2Id) {
      throw new Error("Winner must be one of the match players");
    }

    await ctx.db.patch(args.matchId, {
      winnerId: args.winnerId,
      status: "completed",
      resultDeclaredAt: Date.now(),
    });

    // Update winner's stats
    const winner = await ctx.db.get(args.winnerId);
    if (winner) {
      await ctx.db.patch(args.winnerId, {
        totalWins: (winner.totalWins || 0) + 1,
        totalMatches: (winner.totalMatches || 0) + 1,
        totalEarnings: (winner.totalEarnings || 0) + (match.entryFee * 2 * 0.9), // 90% payout
      });
    }

    // Update loser's stats
    const loserId = args.winnerId === match.player1Id ? match.player2Id : match.player1Id;
    if (loserId) {
      const loser = await ctx.db.get(loserId);
      if (loser) {
        await ctx.db.patch(loserId, {
          totalMatches: (loser.totalMatches || 0) + 1,
        });
      }
    }

    // Create payout transaction
    await ctx.db.insert("transactions", {
      userId: args.winnerId,
      type: "match_payout",
      amount: match.entryFee * 2 * 0.9, // 90% payout (10% platform fee)
      status: "approved",
      matchId: args.matchId,
    });

    return null;
  },
});