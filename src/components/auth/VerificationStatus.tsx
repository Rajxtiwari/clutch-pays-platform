import { useAuth } from "@/hooks/use-auth";
import { EmailVerification } from "./EmailVerification";
import { PlayerVerification } from "./PlayerVerification";
import { HostVerification } from "./HostVerification";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VerificationStatus() {
  const { user } = useAuth();

  if (!user) return null;

  const { verificationLevel } = user;

  let statusText = "Unknown";
  let statusVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  let description = "We couldn't determine your verification status.";

  switch (verificationLevel) {
    case "unverified":
    case "pending_email":
      statusText = "Email Verification Required";
      statusVariant = "destructive";
      description = "Please verify your email to get Level 1 access.";
      break;
    case "level_1_verified":
      statusText = "Level 1 Verified (Email)";
      statusVariant = "default";
      description = "Your email is verified. Apply for Player Verification to get Level 2 access.";
      break;
    case "level_2_pending":
      statusText = "Player Verification Pending";
      statusVariant = "secondary";
      description = "Your request for player verification is under review.";
      break;
    case "level_2_verified":
      statusText = "Level 2 Verified (Player)";
      statusVariant = "default";
      description = "You are a verified player. Apply for Host Verification to get Level 3 access.";
      break;
    case "level_3_pending":
      statusText = "Host Verification Pending";
      statusVariant = "secondary";
      description = "Your request for host verification is under review.";
      break;
    case "level_3_verified":
      statusText = "Level 3 Verified (Host)";
      statusVariant = "default";
      description = "You are a verified host and can create matches.";
      break;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Status</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant={statusVariant}>{statusText}</Badge>
        {(verificationLevel === "unverified" || verificationLevel === "pending_email") && (
          <EmailVerification />
        )}
        {verificationLevel === "level_1_verified" && <PlayerVerification />}
        {verificationLevel === "level_2_verified" && <HostVerification />}
      </CardContent>
    </Card>
  );
}