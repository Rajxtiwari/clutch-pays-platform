import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { GamepadIcon, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { SignupForm } from "./SignupForm";
import { TermsAcceptance } from "./TermsAcceptance";

interface SignupData {
  email: string;
  username: string;
  password: string;
  dateOfBirth: string;
}

interface AuthCardProps {
  onAuthSuccess?: () => void;
}

export function AuthCard({ onAuthSuccess }: AuthCardProps) {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [signupStep, setSignupStep] = useState<"form" | "terms">("form");
  const [signupData, setSignupData] = useState<SignupData | null>(null);

  // Sign In with Email/Password
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("password", {
        email: signInEmail,
        password: signInPassword,
        flow: "signIn",
      });
      
      toast.success("Welcome back!");
      onAuthSuccess?.();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupFormNext = (data: SignupData) => {
    setSignupData(data);
    setSignupStep("terms");
  };

  const handleTermsAccept = async () => {
    if (!signupData) return;

    setIsLoading(true);
    try {
      await signIn("password", {
        email: signupData.email,
        password: signupData.password,
        username: signupData.username,
        dateOfBirth: signupData.dateOfBirth,
        flow: "signUp",
      });

      toast.success("Account created successfully! Welcome to GameArena!");
      onAuthSuccess?.();
    } catch (error: any) {
      console.error("Sign up error:", error);
      if (error.message?.includes("already exists")) {
        toast.error("An account with this email already exists. Please sign in instead.");
        setSignupStep("form");
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsBack = () => {
    setSignupStep("form");
  };

  if (signupStep === "terms") {
    return (
      <TermsAcceptance
        onAccept={handleTermsAccept}
        onBack={handleTermsBack}
        isLoading={isLoading}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <GamepadIcon className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to GameArena</CardTitle>
          <p className="text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <SignupForm onNext={handleSignupFormNext} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}