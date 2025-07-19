import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/webhooks/cashfree",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const signature = request.headers.get("x-webhook-signature");
      const timestamp = request.headers.get("x-webhook-timestamp");
      const body = await request.text();

      if (!signature || !timestamp) {
        return new Response("Missing webhook headers", { status: 400 });
      }

      // Verify webhook signature
      const crypto = await import("crypto");
      const secretKey = process.env.CASHFREE_SECRET_KEY;
      const signedPayload = timestamp + body;
      const expectedSignature = crypto
        .createHmac("sha256", secretKey!)
        .update(signedPayload)
        .digest("base64");

      if (expectedSignature !== signature) {
        return new Response("Invalid signature", { status: 400 });
      }

      const webhookData = JSON.parse(body);
      
      switch (webhookData.type) {
        case "PAYMENT_SUCCESS_WEBHOOK":
          await ctx.runAction(internal.payments.verifyPayment, {
            orderId: webhookData.data.order.order_id,
          });
          break;
        case "PAYMENT_FAILED_WEBHOOK":
          await ctx.runAction(internal.payments.verifyPayment, {
            orderId: webhookData.data.order.order_id,
          });
          break;
        case "PAYMENT_USER_DROPPED_WEBHOOK":
          await ctx.runAction(internal.payments.verifyPayment, {
            orderId: webhookData.data.order.order_id,
          });
          break;
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;