import { useAuthOverlay } from "@/contexts/AuthContext";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { LoadingScreen } from "@/components/ui/loading";
import { useEffect } from "react";

export function Protected({ children }: { children: React.ReactNode }) {
  const { openAuthOverlay } = useAuthOverlay();

  return (
    <>
      <AuthLoading>
        <LoadingScreen message="Authenticating..." />
      </AuthLoading>
      
      <Unauthenticated>
        <UnauthenticatedHandler openAuthOverlay={openAuthOverlay} />
      </Unauthenticated>
      
      <Authenticated>
        {children}
      </Authenticated>
    </>
  );
}

function UnauthenticatedHandler({ openAuthOverlay }: { openAuthOverlay: () => void }) {
  useEffect(() => {
    openAuthOverlay();
  }, [openAuthOverlay]);

  return (
    <LoadingScreen message="Please sign in to continue..." />
  );
}