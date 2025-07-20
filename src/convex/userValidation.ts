import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  returns: v.object({
    available: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser) {
      return {
        available: false,
        message: "Username is already taken",
      };
    }

    return {
      available: true,
      message: "Username is available",
    };
  },
});

export const checkEmailAvailability = query({
  args: { email: v.string() },
  returns: v.object({
    available: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      return {
        available: false,
        message: "Email is already registered",
      };
    }

    return {
      available: true,
      message: "Email is available",
    };
  },
});