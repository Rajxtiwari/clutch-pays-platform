import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { AuthCard } from "./AuthCard";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function AuthOverlay() {
  const { showAuthOverlay, closeAuthOverlay } = useAuthOverlay();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Close overlay and redirect when user becomes authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && showAuthOverlay) {
      closeAuthOverlay();
      // Navigate to dashboard after closing overlay
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    }
  }, [isAuthenticated, isLoading, showAuthOverlay, closeAuthOverlay, navigate]);

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