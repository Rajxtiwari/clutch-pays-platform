
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function PlayerVerification() {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const requestVerification = useMutation(api.users.requestPlayerVerification);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestVerification({ fullName, dateOfBirth });
      toast.success("Verification request submitted successfully!");
      // Optionally reset form or update UI state
      setFullName("");
      setDateOfBirth("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit verification request.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Verification (Level 2)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          To participate in matches, please verify your identity. Submit your legal name and date of birth.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full legal name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit for Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}