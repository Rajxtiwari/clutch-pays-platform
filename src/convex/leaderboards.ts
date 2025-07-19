import { query } from "./_generated/server";
import { v } from "convex/values";

export const topEarners = query({
  args: { 
    period: v.union(v.literal("7d"), v.literal("30d"), v.literal("all")) 
  },
  returns: v.array(v.object({
    _id: v.id("users"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    totalEarnings: v.number(),
    rank: v.number(),
  })),
  handler: async (ctx, args) => {
    const now = Date.now();
    let startTime = 0;
    
    if (args.period === "7d") {
      startTime = now - (7 * 24 * 60 * 60 * 1000);
    } else if (args.period === "30d") {
      startTime = now - (30 * 24 * 60 * 60 * 1000);
    }

    // Get all users who are not private
    const users = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("isProfilePrivate"), true))
      .collect();

    // Calculate earnings for each user
    const userEarnings = await Promise.all(
      users.map(async (user) => {
        let earnings = 0;
        
        if (args.period === "all") {
          earnings = user.totalEarnings || 0;
        } else {
          // Get transactions for the period
          const transactions = await ctx.db
            .query("transactions")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .filter((q) => 
              q.and(
                q.eq(q.field("type"), "match_payout"),
                q.eq(q.field("status"), "approved"),
                q.gte(q.field("_creationTime"), startTime)
              )
            )
            .collect();
          
          earnings = transactions.reduce((sum, t) => sum + t.amount, 0);
        }

        return {
          _id: user._id,
          name: user.name,
          image: user.image,
          totalEarnings: earnings,
          rank: 0, // Will be set after sorting
        };
      })
    );

    // Sort by earnings and assign ranks
    const sorted = userEarnings
      .filter(u => u.totalEarnings > 0)
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 50) // Top 50
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    return sorted;
  },
});

export const topWinRate = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    totalMatches: v.number(),
    totalWins: v.number(),
    winRate: v.number(),
    rank: v.number(),
  })),
  handler: async (ctx) => {
    // Get all users who are not private and have at least 20 matches
    const users = await ctx.db
      .query("users")
      .filter((q) => 
        q.and(
          q.neq(q.field("isProfilePrivate"), true),
          q.gte(q.field("totalMatches"), 20)
        )
      )
      .collect();

    const userStats = users.map((user) => ({
      _id: user._id,
      name: user.name,
      image: user.image,
      totalMatches: user.totalMatches || 0,
      totalWins: user.totalWins || 0,
      winRate: user.totalMatches ? ((user.totalWins || 0) / user.totalMatches) * 100 : 0,
      rank: 0,
    }));

    // Sort by win rate and assign ranks
    const sorted = userStats
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 50)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    return sorted;
  },
});

export const topHosts = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    hostRating: v.number(),
    totalHosted: v.number(),
    rank: v.number(),
  })),
  handler: async (ctx) => {
    // Get all hosts who are not private
    const hosts = await ctx.db
      .query("users")
      .filter((q) => 
        q.and(
          q.eq(q.field("verificationLevel"), "host"),
          q.neq(q.field("isProfilePrivate"), true)
        )
      )
      .collect();

    const hostStats = await Promise.all(
      hosts.map(async (host) => {
        // Count matches hosted
        const hostedMatches = await ctx.db
          .query("matches")
          .withIndex("by_host", (q) => q.eq("hostId", host._id))
          .collect();

        return {
          _id: host._id,
          name: host.name,
          image: host.image,
          hostRating: host.hostRating || 0,
          totalHosted: hostedMatches.length,
          rank: 0,
        };
      })
    );

    // Sort by rating and assign ranks
    const sorted = hostStats
      .filter(h => h.totalHosted > 0)
      .sort((a, b) => b.hostRating - a.hostRating)
      .slice(0, 50)
      .map((host, index) => ({
        ...host,
        rank: index + 1,
      }));

    return sorted;
  },
});
