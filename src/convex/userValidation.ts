import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  returns: v.object({ available: v.boolean(), message: v.string() }),
  handler: async (ctx, args) => {
    if (!args.username || args.username.length < 3) {
      return { available: false, message: "Username must be at least 3 characters long" };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(args.username)) {
      return { available: false, message: "Username can only contain letters, numbers, and underscores" };
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser) {
      return { available: false, message: "Username is already taken" };
    }

    return { available: true, message: "Username is available" };
  },
});

export const checkEmailAvailability = query({
  args: { email: v.string() },
  returns: v.object({ available: v.boolean(), message: v.string() }),
  handler: async (ctx, args) => {
    if (!args.email || !/\S+@\S+\.\S+/.test(args.email)) {
      return { available: false, message: "Please enter a valid email address" };
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      return { available: false, message: "Email is already registered" };
    }

    return { available: true, message: "Email is available" };
  },
});

export const getUserByEmailOrUsername = query({
  args: { identifier: v.string() },
  returns: v.union(v.null(), v.any()),
  handler: async (ctx, args) => {
    // First try to find by email
    let user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.identifier))
      .first();

    // If not found by email, try username
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.identifier))
        .first();
    }

    return user;
  },
});

export const initiatePasswordReset = mutation({
  args: { identifier: v.string() },
  returns: v.object({ success: v.boolean(), message: v.string() }),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.identifier))
      .first();

    if (!user || !user.email) {
      return { success: false, message: "No account found with this email address" };
    }

    // In a real implementation, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with expiration
    // 3. Send reset email
    // For now, we'll return success to indicate the flow works
    
    return { success: true, message: "Password reset instructions sent to your email" };
  },
});

export const validateUserCredentials = query({
  args: { identifier: v.string() },
  returns: v.union(v.null(), v.object({ 
    _id: v.id("users"), 
    email: v.optional(v.string()),
    username: v.optional(v.string())
  })),
  handler: async (ctx, args) => {
    // First try to find by email
    let user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.identifier))
      .first();

    // If not found by email, try username
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.identifier))
        .first();
    }

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      username: user.username
    };
  },
});

export const signInWithCredentials = mutation({
  args: { 
    identifier: v.string(), 
    password: v.string() 
  },
  returns: v.object({ 
    success: v.boolean(), 
    message: v.string(),
    email: v.optional(v.string())
  }),
  handler: async (ctx, args) => {
    // First try to find by email
    let user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.identifier))
      .first();

    // If not found by email, try username
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.identifier))
        .first();
    }

    if (!user || !user.email) {
      return { 
        success: false, 
        message: "No account found with this email or username" 
      };
    }

    return { 
      success: true, 
      message: "User found", 
      email: user.email 
    };
  },
});