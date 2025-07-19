import { useAuthOverlay } from "@/contexts/AuthContext";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { LoadingScreen } from "@/components/ui/loading";
import { useEffect, useRef } from "react";

export function Protected({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthLoading>
        <LoadingScreen message="Authenticating..." />
      </AuthLoading>
      
      <Unauthenticated>
        <UnauthenticatedHandler />
      </Unauthenticated>
      
      <Authenticated>
        {children}
      </Authenticated>
    </>
  );
}

function UnauthenticatedHandler() {
  const { openAuthOverlay } = useAuthOverlay();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      openAuthOverlay();
    }
  }, [openAuthOverlay]);

  return (
    <LoadingScreen message="Please sign in to continue..." />
  );
}