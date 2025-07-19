import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { AuthCard } from "./AuthCard";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function AuthOverlay() {
  const { showAuthOverlay, closeAuthOverlay } = useAuthOverlay();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && showAuthOverlay) {
      closeAuthOverlay();
      navigate("/dashboard");
    }
  }, [isAuthenticated, showAuthOverlay, closeAuthOverlay, navigate]);

  return (
    <Dialog open={showAuthOverlay} onOpenChange={closeAuthOverlay}>
      <DialogContent className="max-w-md w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
        <div className="w-full h-full max-h-[95vh] overflow-y-auto bg-background rounded-lg border shadow-lg">
          <div className="p-6">
            <AuthCard />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}