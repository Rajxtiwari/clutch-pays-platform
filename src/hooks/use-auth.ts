import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";

export function useAuth() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  const authActions = useAuthActions();

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn: authActions?.signIn || (() => Promise.reject(new Error("Auth not ready"))),
    signOut: authActions?.signOut || (() => Promise.reject(new Error("Auth not ready"))),
  };
}