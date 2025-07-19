import { useAuthOverlay } from "@/contexts/AuthContext";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function Protected({ children }: { children: React.ReactNode }) {
  const { openAuthOverlay } = useAuthOverlay();

  return (
    <>
      <AuthLoading>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
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
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>
  );
}