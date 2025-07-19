import { useAuth } from "@/hooks/use-auth";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function Protected({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthOverlay();
    }
  }, [isAuthenticated, isLoading, openAuthOverlay]);

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