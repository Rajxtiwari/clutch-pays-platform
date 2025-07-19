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
      <DialogContent className="modal-responsive bg-transparent border-none shadow-none p-0 sm:p-4">
        <VisuallyHidden>
          <DialogTitle>Authentication</DialogTitle>
        </VisuallyHidden>
        <div className="w-full h-full overflow-y-auto">
          <AuthCard onAuthSuccess={handleAuthSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}