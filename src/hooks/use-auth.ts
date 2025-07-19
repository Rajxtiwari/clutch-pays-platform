import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  const authActions = useAuthActions();
  const [isLoading, setIsLoading] = useState(true);

  // This effect updates the loading state once auth is loaded and user data is available
  useEffect(() => {
    if (!isAuthLoading) {
      // If authenticated, wait for user data
      if (isAuthenticated && user !== undefined) {
        setIsLoading(false);
      }
      // If not authenticated, we can stop loading immediately
      else if (!isAuthenticated) {
        setIsLoading(false);
      }
    }
  }, [isAuthLoading, isAuthenticated, user]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn: authActions?.signIn || (() => Promise.reject(new Error("Auth not ready"))),
    signOut: authActions?.signOut || (() => Promise.reject(new Error("Auth not ready"))),
  };
}