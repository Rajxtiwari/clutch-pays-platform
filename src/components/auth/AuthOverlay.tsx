import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { AuthCard } from "./AuthCard";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export function AuthOverlay() {
  const { showAuthOverlay, closeAuthOverlay } = useAuthOverlay();
  const { isAuthenticated } = useAuth();

  // Close overlay when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showAuthOverlay) {
      closeAuthOverlay();
    }
  }, [isAuthenticated, showAuthOverlay, closeAuthOverlay]);

  const handleAuthSuccess = () => {
    closeAuthOverlay();
  };

  return (
    <Dialog open={showAuthOverlay} onOpenChange={closeAuthOverlay}>
      <DialogContent className="bg-transparent border-none shadow-none max-w-md">
        <AuthCard onAuthSuccess={handleAuthSuccess} />
      </DialogContent>
    </Dialog>
  );
}
