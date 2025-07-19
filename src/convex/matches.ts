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
      throw new Error("Only verified hosts can create matches");
    }

    // Server-side validation
    if (args.entryFee < 10 || args.entryFee > 10000) {
      throw new Error("Entry fee must be between ₹10 and ₹10,000");
    }

    if (args.startTime < Date.now()) {
      throw new Error("Match start time must be in the future");
    }

    if (!args.title.trim() || args.title.length > 100) {
      throw new Error("Match title must be between 1-100 characters");
    }

    // Verify game exists
    const game = await ctx.db.get(args.gameId);
    if (!game || !game.isActive) {
      throw new Error("Invalid or inactive game selected");
    }

    return await ctx.db.insert("matches", {
      hostId: user._id,
      gameId: args.gameId,
      title: args.title.trim(),
      entryFee: args.entryFee,
      startTime: args.startTime,
      streamUrl: args.streamUrl,
      status: "open",
    });
  },
});

export const joinMatch = mutation({
  args: {
    matchId: v.id("matches"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (user.verificationLevel !== "player" && user.verificationLevel !== "host") {
      throw new Error("Only verified players can join matches");
    }

    const match = await ctx.db.get(args.matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    if (match.status !== "open") {
      throw new Error("Match is not open for joining");
    }

    if (match.hostId === user._id) {
      throw new Error("Host cannot join their own match");
    }

    // Check wallet balance
    if ((user.walletBalance || 0) < match.entryFee) {
      throw new Error("Insufficient wallet balance");
    }

    // Check if match is full
    if (match.player1Id && match.player2Id) {
      throw new Error("Match is already full");
    }

    // Check if user already joined
    if (match.player1Id === user._id || match.player2Id === user._id) {
      throw new Error("You have already joined this match");
    }

    // Deduct entry fee from wallet
    await ctx.db.patch(user._id, {
      walletBalance: (user.walletBalance || 0) - match.entryFee,
    });

    // Add player to match
    const updateData = match.player1Id 
      ? { player2Id: user._id, status: "live" as const }
      : { player1Id: user._id };

    await ctx.db.patch(args.matchId, updateData);

    // Create transaction record
    await ctx.db.insert("transactions", {
      userId: user._id,
      type: "match_entry",
      amount: -match.entryFee,
      status: "approved",
      matchId: args.matchId,
    });

    return null;
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

    // Prevent duplicate winner declaration
    if (match.winnerId) {
      throw new Error("Winner has already been declared for this match");
    }

    await ctx.db.patch(args.matchId, {
      winnerId: args.winnerId,
      status: "completed",
      resultDeclaredAt: Date.now(),
    });

    // Calculate payout (90% of total pool)
    const totalPool = match.entryFee * 2;
    const payout = Math.floor(totalPool * 0.9);

    // Update winner's stats and wallet
    const winner = await ctx.db.get(args.winnerId);
    if (winner) {
      await ctx.db.patch(args.winnerId, {
        totalWins: (winner.totalWins || 0) + 1,
        totalMatches: (winner.totalMatches || 0) + 1,
        totalEarnings: (winner.totalEarnings || 0) + payout,
        walletBalance: (winner.walletBalance || 0) + payout,
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
      amount: payout,
      status: "approved",
      matchId: args.matchId,
    });

    return null;
  },
});