/**
 * This component should be used on the header of the landing page to allow the user to sign in or sign up.
 * It will show a modal by default. Set the useModal prop to false to redirect to the auth page instead.
 */

"use client";

import { Button } from "@/components/ui/button";
import { useAuthOverlay } from "@/contexts/AuthContext";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { Loading } from "@/components/ui/loading";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Button disabled>
        <div className="flex items-center gap-2">
          <Loading size="sm" />
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
          <Button onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        )}
      </Authenticated>

      <Unauthenticated>
        <UnauthenticatedButton trigger={trigger} />
      </Unauthenticated>
    </div>
  );
}