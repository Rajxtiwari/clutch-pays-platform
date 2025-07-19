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
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [signupStep, setSignupStep] = useState<"form" | "terms">("form");
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    username: "",
    password: "",
    dateOfBirth: "",
  });

  const handleEmailSignIn = async (email: string) => {
    setIsLoading(true);
    try {
      await signIn("resend-otp", { email });
      toast.success("Check your email for the verification code");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to send verification email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupFormComplete = (data: SignupData) => {
    setSignupData(data);
    setSignupStep("terms");
  };

  const handleTermsAccept = async () => {
    setIsLoading(true);
    try {
      await signIn("password", {
        email: signupData.email,
        password: signupData.password,
        flow: "signUp",
        name: signupData.username,
        username: signupData.username,
        dateOfBirth: signupData.dateOfBirth,
      });
      
      toast.success("Account created successfully! Welcome to GameArena!");
      
      // Call the success callback if provided
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error?.message || "Failed to create account. Please try again.");
      setSignupStep("form"); // Go back to form on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setSignupStep("form");
  };

  if (signupStep === "terms") {
    return (
      <TermsAcceptance
        onAccept={handleTermsAccept}
        onBack={handleBackToForm}
        isLoading={isLoading}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <GamepadIcon className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to GameArena</CardTitle>
          <p className="text-muted-foreground">
            Join the ultimate skill-based gaming platform
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <EmailSignInForm onSubmit={handleEmailSignIn} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <SignupForm 
                onComplete={handleSignupFormComplete}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmailSignInForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (email: string) => void;
  isLoading: boolean;
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !email.trim()}>
        {isLoading ? (
          "Sending..."
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Verification Code
          </>
        )}
      </Button>
    </form>
  );
}