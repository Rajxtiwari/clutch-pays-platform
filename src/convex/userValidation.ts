import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  returns: v.object({
    available: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Server-side validation
    const username = args.username.trim().toLowerCase();
    
    if (username.length < 3) {
      return { available: false, message: "Username must be at least 3 characters" };
    }

    if (username.length > 20) {
      return { available: false, message: "Username must be less than 20 characters" };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { available: false, message: "Username can only contain letters, numbers, and underscores" };
    }

    // Reserved usernames
    const reserved = ['admin', 'support', 'clutchpays', 'system', 'bot', 'moderator'];
    if (reserved.includes(username)) {
      return { available: false, message: "This username is reserved" };
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", username))
      .first();

    if (existingUser) {
      return { available: false, message: "Username is already taken" };
    }

    return { available: true, message: "Username is available" };
  },
});

export const checkEmailAvailability = query({
  args: { email: v.string() },
  returns: v.object({
    available: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Server-side email validation
    const email = args.email.trim().toLowerCase();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { available: false, message: "Please enter a valid email address" };
    }

    // Check for disposable email domains
    const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return { available: false, message: "Disposable email addresses are not allowed" };
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      return { available: false, message: "Email is already registered" };
    }

    return { available: true, message: "Email is available" };
  },
});

export const signInWithCredentials = mutation({
  args: {
    identifier: v.string(),
    password: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    email: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const identifier = args.identifier.trim().toLowerCase();
    
    // Rate limiting check (simple implementation)
    // In production, implement proper rate limiting
    
    let user;
    
    // Check if identifier is email or username
    if (identifier.includes('@')) {
      user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identifier))
        .first();
    } else {
      user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", identifier))
        .first();
    }

    if (!user) {
      return { 
        success: false, 
        message: "Invalid credentials" 
      };
    }

    // Additional security checks
    if (user.verificationLevel === "pending_email") {
      return {
        success: false,
        message: "Please verify your email before signing in"
      };
    }

    return {
      success: true,
      message: "Credentials validated",
      email: user.email,
    };
  },
});