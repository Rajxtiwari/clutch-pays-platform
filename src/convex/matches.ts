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
    const user = await getCurrentUser(ctx);
    
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("matches")
      .filter((q) => 
        q.or(
          q.eq(q.field("hostId"), user._id),
          q.eq(q.field("player1Id"), user._id),
          q.eq(q.field("player2Id"), user._id)
        )
      )
      .order("desc")
      .take(50);
  },
});
