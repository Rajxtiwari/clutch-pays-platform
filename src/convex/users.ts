import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (user === null) {
      return null;
    }

    return user;
  },
});

/**
 * Use this function internally to get the current user data. Remember to handle the null user case.
 * @param ctx
 * @returns
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
};

export const getTopEarners = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.and(
        q.neq(q.field("isProfilePrivate"), true),
        q.gt(q.field("totalEarnings"), 0)
      ))
      .order("desc")
      .take(10);
    
    return users.sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0));
  },
});

export const getTopWinRate = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.and(
        q.neq(q.field("isProfilePrivate"), true),
        q.gte(q.field("totalMatches"), 20)
      ))
      .collect();
    
    return users
      .sort((a, b) => {
        const aWinRate = a.totalMatches ? (a.totalWins || 0) / a.totalMatches : 0;
        const bWinRate = b.totalMatches ? (b.totalWins || 0) / b.totalMatches : 0;
        return bWinRate - aWinRate;
      })
      .slice(0, 10);
  },
});

export const getTopHosts = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.and(
        q.neq(q.field("isProfilePrivate"), true),
        q.eq(q.field("verificationLevel"), "host"),
        q.gt(q.field("hostRating"), 0)
      ))
      .order("desc")
      .take(10);
    
    return users.sort((a, b) => (b.hostRating || 0) - (a.hostRating || 0));
  },
});