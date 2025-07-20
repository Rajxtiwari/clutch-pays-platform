import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";

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

export const updateUserProfile = mutation({
  args: {
    name: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingUser = await ctx.db.get(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    await ctx.db.patch(userId, {
      name: args.name,
      username: args.username,
    });
  },
});

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

export const requestPlayerVerification = mutation({
  args: { fullName: v.string(), dateOfBirth: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Check for existing pending request
    const existingRequest = await ctx.db
      .query("verificationRequests")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", user._id).eq("status", "pending")
      )
      .first();

    if (existingRequest) {
      throw new ConvexError("You already have a pending verification request.");
    }

    // Update user verification status
    await ctx.db.patch(user._id, {
      verificationLevel: "level_2_pending",
      // Storing the full name and DOB on the user document itself
      name: args.fullName,
      dateOfBirth: args.dateOfBirth,
    });

    // Create a verification request entry
    await ctx.db.insert("verificationRequests", {
      userId: user._id,
      level: "level_2_verified", // The level they are trying to achieve
      status: "pending",
    });
  },
});

export const requestHostVerification = mutation({
  args: {
    socialMediaLink: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new ConvexError("User not found");
    }

    if (user.verificationLevel !== "level_2_verified") {
      throw new ConvexError("You must be a verified player to apply for host verification.");
    }

    // Check for existing pending request
    const existingRequest = await ctx.db
      .query("verificationRequests")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", user._id).eq("status", "pending")
      )
      .first();

    if (existingRequest) {
      throw new ConvexError("You already have a pending verification request.");
    }

    // Update user verification status to pending host
    await ctx.db.patch(user._id, {
      verificationLevel: "level_3_pending",
    });

    // Create a verification request entry for host
    await ctx.db.insert("verificationRequests", {
      userId: user._id,
      level: "level_3_verified", // The level they are trying to achieve
      status: "pending",
      details: {
        socialMediaLink: args.socialMediaLink,
        reason: args.reason,
      },
    });
  },
});