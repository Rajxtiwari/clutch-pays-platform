// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.username as string,
      username: params.username as string,
      dateOfBirth: params.dateOfBirth as string,
      verificationLevel: "unverified",
      walletBalance: 0,
      totalMatches: 0,
      totalWins: 0,
      totalEarnings: 0,
      isProfilePrivate: false,
    };
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    CustomPassword,
    // Add email OTP as fallback
    {
      id: "resend-otp",
      name: "Email OTP",
      type: "email",
      maxAge: 60 * 15, // 15 minutes
      generateVerificationToken() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      },
      async sendVerificationRequest({ identifier: email, token }) {
        const axios = await import("axios");
        await axios.default.post(
          "https://email.vly.ai/send_otp",
          {
            to: email,
            otp: token,
            appName: process.env.VLY_APP_NAME || "GameArena",
          },
          {
            headers: {
              "x-api-key": "vlytothemoon2025",
            },
          },
        );
      },
    }
  ],
});