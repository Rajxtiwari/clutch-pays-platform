import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const makeUserAdmin = internalMutation({
  args: { email: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }

    // Update user role to admin
    await ctx.db.patch(user._id, {
      role: "admin"
    });

    return `User ${args.email} is now an admin`;
  },
});
