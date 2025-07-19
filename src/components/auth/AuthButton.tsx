/**
 * This component should be used on the header of the landing page to allow the user to sign in or sign up.
 * It will show a modal by default. Set the useModal prop to false to redirect to the auth page instead.
 */

"use client";

import { Button } from "@/components/ui/button";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";

interface AuthButtonProps {
  trigger?: React.ReactNode;
  dashboardTrigger?: React.ReactNode;
  useModal?: boolean;
}

const UnauthenticatedButton = ({ trigger }: AuthButtonProps) => {
  const { openAuthOverlay } = useAuthOverlay();

  return (
    <div onClick={openAuthOverlay} className="cursor-pointer">
      {trigger || <Button>Get Started</Button>}
    </div>
  );
};

export function AuthButton({
  trigger,
  dashboardTrigger,
  useModal = true,
}: AuthButtonProps) {
  const { isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <Button disabled>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </Button>
    );
  }

  return (
    <div>
      <Authenticated>
        {dashboardTrigger ? (
          <div>
            {dashboardTrigger}
          </div>
        ) : (
          <Button>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        )}
      </Authenticated>

      <Unauthenticated>
        <UnauthenticatedButton trigger={trigger} />
      </Unauthenticated>
    </div>
  );
}