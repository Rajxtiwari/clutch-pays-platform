import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { GamepadIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { SignupForm } from "./SignupForm";
import { TermsAcceptance } from "./TermsAcceptance";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    username: "",
    password: "",
    dateOfBirth: "",
  });
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const signInWithCredentials = useMutation(api.userValidation.signInWithCredentials);

  const handlePasswordSignIn = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signInWithCredentials({ identifier, password });
      
      if (!result.success || !result.email) {
        toast.error(result.message);
        return;
      }

      await signIn("password", { 
        email: result.email,
        password,
        flow: "signIn"
      });
      
      toast.success("Welcome back to Clutch Pays!");
      
      // Call success callback immediately
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error?.message || "Invalid credentials. Please try again.");
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
      
      toast.success("Account created successfully! Welcome to Clutch Pays!");
      
      // Call success callback immediately
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error?.message || "Failed to create account. Please try again.");
      setSignupStep("form");
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
              <img src="/assets/logo.png" alt="Clutch Pays" className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Clutch Pays</CardTitle>
          <p className="text-muted-foreground">
            Join the ultimate skill-based gaming platform
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <SignInForm 
                onPasswordSignIn={handlePasswordSignIn}
                isLoading={isLoading} 
              />
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

function SignInForm({ 
  onPasswordSignIn,
  isLoading 
}: { 
  onPasswordSignIn: (identifier: string, password: string) => void;
  isLoading: boolean;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim() && password.trim()) {
      onPasswordSignIn(identifier.trim(), password.trim());
    }
  };

  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Email or Username</Label>
        <Input
          id="identifier"
          type="text"
          placeholder="Enter your email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !identifier.trim() || !password.trim()}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}