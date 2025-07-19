import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { emailOtp } from "./auth/emailOtp";
import { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
      username: params.username as string,
      dateOfBirth: params.dateOfBirth as string,
      verificationLevel: "pending_email",
      walletBalance: 0,
      totalMatches: 0,
      totalWins: 0,
      totalEarnings: 0,
      isProfilePrivate: false,
    };
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword, emailOtp],
});