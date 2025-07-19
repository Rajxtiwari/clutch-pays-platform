import { useAuth } from "@/hooks/use-auth";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export function Protected({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const { openAuthOverlay, showAuthOverlay } = useAuthOverlay();
  const hasTriggeredAuth = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !showAuthOverlay && !hasTriggeredAuth.current) {
      hasTriggeredAuth.current = true;
      openAuthOverlay();
    }
    
    // Reset the flag when user becomes authenticated
    if (isAuthenticated) {
      hasTriggeredAuth.current = false;
    }
  }, [isAuthenticated, isLoading, openAuthOverlay, showAuthOverlay]);

  return (
    <>
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
    </>
  );
}