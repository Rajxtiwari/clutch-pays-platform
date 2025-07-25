import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// User verification levels
export const VERIFICATION_LEVELS = {
  PENDING_EMAIL: "pending_email",
  UNVERIFIED: "unverified",
  LEVEL_1_VERIFIED: "level_1_verified", // Email verified
  LEVEL_2_PENDING: "level_2_pending", // Player verification submitted
  LEVEL_2_VERIFIED: "level_2_verified", // Player verification approved
  LEVEL_3_PENDING: "level_3_pending", // Host verification submitted
  LEVEL_3_VERIFIED: "level_3_verified", // Host verification approved
} as const;

export const verificationLevelValidator = v.union(
  v.literal(VERIFICATION_LEVELS.PENDING_EMAIL),
  v.literal(VERIFICATION_LEVELS.UNVERIFIED),
  v.literal(VERIFICATION_LEVELS.LEVEL_1_VERIFIED),
  v.literal(VERIFICATION_LEVELS.LEVEL_2_PENDING),
  v.literal(VERIFICATION_LEVELS.LEVEL_2_VERIFIED),
  v.literal(VERIFICATION_LEVELS.LEVEL_3_PENDING),
  v.literal(VERIFICATION_LEVELS.LEVEL_3_VERIFIED)
);

// Match statuses
export const MATCH_STATUS = {
  OPEN: "open",
  LIVE: "live", 
  COMPLETED: "completed",
  DISPUTED: "disputed",
  CANCELLED: "cancelled",
} as const;

export const matchStatusValidator = v.union(
  v.literal(MATCH_STATUS.OPEN),
  v.literal(MATCH_STATUS.LIVE),
  v.literal(MATCH_STATUS.COMPLETED),
  v.literal(MATCH_STATUS.DISPUTED),
  v.literal(MATCH_STATUS.CANCELLED),
);

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal", 
  MATCH_ENTRY: "match_entry",
  MATCH_PAYOUT: "match_payout",
  REFUND: "refund",
} as const;

export const transactionTypeValidator = v.union(
  v.literal(TRANSACTION_TYPES.DEPOSIT),
  v.literal(TRANSACTION_TYPES.WITHDRAWAL),
  v.literal(TRANSACTION_TYPES.MATCH_ENTRY),
  v.literal(TRANSACTION_TYPES.MATCH_PAYOUT),
  v.literal(TRANSACTION_TYPES.REFUND),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      // Base Info from Auth Provider
      name: v.optional(v.string()), 
      image: v.optional(v.string()), 
      email: v.optional(v.string()), 
      emailVerificationTime: v.optional(v.number()), 
      isAnonymous: v.optional(v.boolean()), 

      // App-specific user data
      username: v.optional(v.string()),
      dateOfBirth: v.optional(v.string()), // Storing as string for flexibility, validation at app level
      
      // Verification & Financials
      verificationLevel: v.optional(verificationLevelValidator),
      walletBalance: v.optional(v.number()), // Storing as number, represents total balance
      
      // Level 1 KYC Data
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      mobileNumber: v.optional(v.string()),
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      state: v.optional(v.string()),

      // Level 2 KYC Data
      documentType: v.optional(v.string()),
      documentUrl: v.optional(v.string()), // URL to stored document
      
      // Host Specific Data
      hostRating: v.optional(v.number()),

      // User Stats
      totalMatches: v.optional(v.number()),
      totalWins: v.optional(v.number()),
      totalEarnings: v.optional(v.number()),
      isProfilePrivate: v.optional(v.boolean()),
    }).index("email", ["email"]) 
      .index("username", ["username"]), 

    // Games supported on the platform
    games: defineTable({
      name: v.string(),
      icon: v.string(),
      isActive: v.boolean(),
    }),

    // Matches created by hosts
    matches: defineTable({
      hostId: v.id("users"),
      gameId: v.id("games"),
      title: v.string(),
      entryFee: v.number(),
      startTime: v.number(),
      streamUrl: v.string(),
      status: matchStatusValidator,
      winnerId: v.optional(v.id("users")),
      player1Id: v.optional(v.id("users")),
      player2Id: v.optional(v.id("users")),
      disputeReason: v.optional(v.string()),
      resultDeclaredAt: v.optional(v.number()),
      payoutProcessedAt: v.optional(v.number()),
    })
      .index("by_host", ["hostId"])
      .index("by_status", ["status"])
      .index("by_game", ["gameId"])
      .index("by_start_time", ["startTime"]),

    // Financial transactions
    transactions: defineTable({
      userId: v.id("users"),
      type: transactionTypeValidator,
      amount: v.number(),
      status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
      matchId: v.optional(v.id("matches")),
      utrId: v.optional(v.string()),
      paymentScreenshot: v.optional(v.string()),
      adminNotes: v.optional(v.string()),
      uniqueAmount: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"])
      .index("by_type", ["type"]),

    // Chat messages in matches
    chatMessages: defineTable({
      matchId: v.id("matches"),
      userId: v.id("users"),
      message: v.string(),
      timestamp: v.number(),
    }).index("by_match", ["matchId"]),

    // Support tickets
    supportTickets: defineTable({
      userId: v.optional(v.id("users")),
      email: v.string(),
      subject: v.string(),
      message: v.string(),
      status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("closed")),
      matchId: v.optional(v.id("matches")),
      attachments: v.optional(v.array(v.string())),
      adminResponse: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Verification requests
    verificationRequests: defineTable({
      userId: v.id("users"),
      level: verificationLevelValidator,
      status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
      documentUrl: v.optional(v.string()),
      rejectionReason: v.optional(v.string()),
      details: v.optional(v.any()), // To store additional details like social media links
    })
      .index("by_user_and_status", (q) => q.eq("userId", "pending"))
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Site-wide notifications
    notifications: defineTable({
      message: v.string(),
      type: v.union(v.literal("info"), v.literal("success"), v.literal("warning")),
      expirationDate: v.optional(v.number()),
      isActive: v.boolean(),
    }),

    // Community polls
    polls: defineTable({
      question: v.string(),
      options: v.array(v.string()),
      votes: v.array(v.object({
        userId: v.id("users"),
        optionIndex: v.number(),
      })),
      isActive: v.boolean(),
    }),
  },
  {
    schemaValidation: false,
  },
);

export default schema;