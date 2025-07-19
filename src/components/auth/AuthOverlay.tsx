import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { AuthCard } from "./AuthCard";

export function AuthOverlay() {
  const { showAuthOverlay, closeAuthOverlay } = useAuthOverlay();

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