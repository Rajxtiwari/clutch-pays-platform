import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("games"),
    _creationTime: v.number(),
    name: v.string(),
    icon: v.string(),
    isActive: v.boolean(),
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
  },
  returns: v.id("games"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("games", {
      name: args.name,
      icon: args.icon,
      isActive: true,
    });
  },
});
