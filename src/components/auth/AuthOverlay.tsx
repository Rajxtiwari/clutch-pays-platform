import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { AuthCard } from "./AuthCard";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function AuthOverlay() {
  const { showAuthOverlay, closeAuthOverlay } = useAuthOverlay();

  const handleAuthSuccess = () => {
    closeAuthOverlay();
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