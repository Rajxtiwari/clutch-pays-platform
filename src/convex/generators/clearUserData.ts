import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const clearAllUserData = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Keep only admin users
    const adminEmail = "raja20005tiwari@gmail.com";
    
    // Get all users
    const allUsers = await ctx.db.query("users").collect();
    
    // Delete all users except admin
    for (const user of allUsers) {
      if (user.email !== adminEmail) {
        await ctx.db.delete(user._id);
      }
    }
    
    // Clear all transactions
    const allTransactions = await ctx.db.query("transactions").collect();
    for (const transaction of allTransactions) {
      await ctx.db.delete(transaction._id);
    }
    
    // Clear all matches
    const allMatches = await ctx.db.query("matches").collect();
    for (const match of allMatches) {
      await ctx.db.delete(match._id);
    }
    
    // Clear all support tickets
    const allTickets = await ctx.db.query("supportTickets").collect();
    for (const ticket of allTickets) {
      await ctx.db.delete(ticket._id);
    }
    
    // Clear all verification requests
    const allVerifications = await ctx.db.query("verificationRequests").collect();
    for (const verification of allVerifications) {
      await ctx.db.delete(verification._id);
    }
    
    // Clear all chat messages
    const allMessages = await ctx.db.query("chatMessages").collect();
    for (const message of allMessages) {
      await ctx.db.delete(message._id);
    }
    
    console.log("Database cleared! Only admin user remains.");
    return null;
  },
});
