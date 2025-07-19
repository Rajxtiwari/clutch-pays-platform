import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { AuthCard } from "./AuthCard";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";

export function AuthOverlay() {
  const { showAuthOverlay, closeAuthOverlay } = useAuthOverlay();
  const { isAuthenticated } = useConvexAuth();

  // Close overlay if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showAuthOverlay) {
      closeAuthOverlay();
    }
  }, [isAuthenticated, showAuthOverlay, closeAuthOverlay]);

  const handleAuthSuccess = () => {
    closeAuthOverlay();
    // Force navigation to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <Dialog open={showAuthOverlay} onOpenChange={closeAuthOverlay}>
      <DialogContent className="bg-transparent border-none shadow-none max-w-md">
        <VisuallyHidden>
          <DialogTitle>Authentication</DialogTitle>
        </VisuallyHidden>
        <AuthCard onAuthSuccess={handleAuthSuccess} />
      </DialogContent>
    </Dialog>
  );
}