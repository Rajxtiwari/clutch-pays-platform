import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Google } from "@convex-dev/auth/providers/Google";
import { emailOtp } from "./auth/emailOtp";
import { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
      username: params.username as string,
      dateOfBirth: params.dateOfBirth as string,
      verificationLevel: "pending_email", // State 1 for email sign-ups
      walletBalance: 0,
      totalMatches: 0,
      totalWins: 0,
      totalEarnings: 0,
      isProfilePrivate: false,
    };
  },
});

const CustomGoogle = Google<DataModel>({
  profile(profile) {
    return {
      email: profile.email,
      name: profile.name,
      image: profile.picture,
      verificationLevel: "unverified", // State 2 for Google sign-ups
      walletBalance: 0,
      totalMatches: 0,
      totalWins: 0,
      totalEarnings: 0,
      isProfilePrivate: false,
    };
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword, CustomGoogle, emailOtp],
});