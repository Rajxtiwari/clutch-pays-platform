"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Import Cashfree correctly for Node.js environment
let Cashfree: any;
try {
  Cashfree = require("cashfree-pg-sdk-nodejs").Cashfree;
} catch (error) {
  console.error("Failed to import Cashfree SDK:", error);
}

// Initialize Cashfree only if available
if (Cashfree) {
  try {
    Cashfree.XEnvironment = process.env.NODE_ENV === "production" 
      ? "PRODUCTION"
      : "SANDBOX";
    Cashfree.XClientId = process.env.CASHFREE_APP_ID;
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
  } catch (error) {
    console.error("Failed to initialize Cashfree:", error);
  }
}

export const createDepositOrder = action({
  args: {
    amount: v.number(),
  },
  returns: v.object({
    orderId: v.string(),
    paymentSessionId: v.string(),
    amount: v.number(),
  }),
  handler: async (ctx, args): Promise<{
    orderId: string;
    paymentSessionId: string;
    amount: number;
  }> => {
    if (!Cashfree) {
      throw new Error("Cashfree SDK not available");
    }

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user: any = await ctx.runQuery(internal.transactions.getUser, { userId });
    if (!user) {
      throw new Error("User not found");
    }

    if (args.amount < 10) {
      throw new Error("Minimum deposit amount is ₹10");
    }

    if (args.amount > 100000) {
      throw new Error("Maximum deposit amount is ₹1,00,000");
    }

    // Generate unique order ID
    const orderId: string = `DEP_${user._id}_${Date.now()}`;

    try {
      const createOrderRequest = {
        order_id: orderId,
        order_amount: args.amount,
        order_currency: "INR",
        customer_details: {
          customer_id: user._id,
          customer_name: user.name || "User",
          customer_email: user.email || "",
          customer_phone: user.mobileNumber || "9999999999",
        },
        order_meta: {
          return_url: `${process.env.CONVEX_SITE_URL}/payment/callback?order_id={order_id}`,
          notify_url: `${process.env.CONVEX_SITE_URL}/api/webhooks/cashfree`,
        },
      };

      const response = await Cashfree.PGCreateOrder("2023-08-01", createOrderRequest);
      
      if (!response.data) {
        throw new Error("Failed to create payment order");
      }

      // Store the order in database
      await ctx.runMutation(internal.transactions.storePaymentOrder, {
        orderId,
        userId: user._id,
        amount: args.amount,
        paymentSessionId: response.data.payment_session_id,
        status: "pending",
      });

      return {
        orderId,
        paymentSessionId: response.data.payment_session_id,
        amount: args.amount,
      };
    } catch (error) {
      console.error("Cashfree order creation error:", error);
      throw new Error("Failed to create payment order");
    }
  },
});

export const verifyPayment = internalAction({
  args: {
    orderId: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    if (!Cashfree) {
      return { success: false, message: "Cashfree SDK not available" };
    }

    try {
      const response = await Cashfree.PGOrderFetchOrder("2023-08-01", args.orderId);
      
      if (!response.data) {
        return { success: false, message: "Payment verification failed" };
      }

      const orderStatus = response.data.order_status;
      
      if (orderStatus === "PAID") {
        // Update transaction status and add money to wallet
        await ctx.runMutation(internal.transactions.processSuccessfulPayment, {
          orderId: args.orderId,
          amount: response.data.order_amount,
        });
        
        return { success: true, message: "Payment successful" };
      } else if (orderStatus === "FAILED") {
        await ctx.runMutation(internal.transactions.processFailedPayment, {
          orderId: args.orderId,
        });
        
        return { success: false, message: "Payment failed" };
      } else {
        return { success: false, message: "Payment is still pending" };
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      return { success: false, message: "Payment verification failed" };
    }
  },
});

// Public action for frontend to call
export const verifyPaymentPublic = action({
  args: {
    orderId: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args): Promise<{
    success: boolean;
    message: string;
  }> => {
    return await ctx.runAction(internal.payments.verifyPayment, {
      orderId: args.orderId,
    });
  },
});