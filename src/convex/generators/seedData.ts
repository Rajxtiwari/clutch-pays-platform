import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const seedGames = internalMutation({
  args: {},
  returns: v.array(v.id("games")),
  handler: async (ctx) => {
    // Check if games already exist
    const existingGames = await ctx.db.query("games").collect();
    if (existingGames.length > 0) {
      return existingGames.map(g => g._id);
    }

    // Create initial games
    const games = [
      { name: "Valorant", icon: "🎯" },
      { name: "CS:GO", icon: "🔫" },
      { name: "PUBG Mobile", icon: "🎮" },
      { name: "Free Fire", icon: "🔥" },
      { name: "Call of Duty Mobile", icon: "⚔️" },
      { name: "Clash Royale", icon: "👑" },
    ];

    const gameIds = [];
    for (const game of games) {
      const gameId = await ctx.db.insert("games", {
        name: game.name,
        icon: game.icon,
        isActive: true,
      });
      gameIds.push(gameId);
    }

    return gameIds;
  },
});
