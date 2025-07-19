import { useAuthOverlay } from "@/contexts/AuthContext";
import { useAuth } from "./use-auth";

export function useAuthTrigger() {
  const { openAuthOverlay } = useAuthOverlay();
  const { isAuthenticated } = useAuth();

  const triggerAuth = () => {
    if (!isAuthenticated) {
      openAuthOverlay();
    }
  };

  return { triggerAuth, isAuthenticated };
}
