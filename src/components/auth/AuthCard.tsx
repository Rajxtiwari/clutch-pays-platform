import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { GamepadIcon, Mail, ArrowRight, Eye, EyeOff, Key } from "lucide-react";
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
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot">("signin");

  const initiatePasswordReset = useMutation(api.userValidation.initiatePasswordReset);
  const signInWithCredentials = useMutation(api.userValidation.signInWithCredentials);

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
      
      toast.success("Welcome back to GameArena!");
      
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
      
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (identifier: string) => {
    setIsLoading(true);
    try {
      const result = await initiatePasswordReset({ identifier });
      if (result.success) {
        toast.success(result.message);
        setAuthMode("signin");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email");
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
      
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
      
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
              <GamepadIcon className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to GameArena</CardTitle>
          <p className="text-muted-foreground">
            Join the ultimate skill-based gaming platform
          </p>
        </CardHeader>
        <CardContent>
          {authMode === "forgot" ? (
            <ForgotPasswordForm 
              onSubmit={handleForgotPassword} 
              onBack={() => setAuthMode("signin")}
              isLoading={isLoading} 
            />
          ) : (
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "signin" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <SignInForm 
                  onPasswordSignIn={handlePasswordSignIn}
                  onEmailSignIn={handleEmailSignIn}
                  onForgotPassword={() => setAuthMode("forgot")}
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
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SignInForm({ 
  onPasswordSignIn,
  onEmailSignIn, 
  onForgotPassword,
  isLoading 
}: { 
  onPasswordSignIn: (identifier: string, password: string) => void;
  onEmailSignIn: (email: string) => void;
  onForgotPassword: () => void;
  isLoading: boolean;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signInMode, setSignInMode] = useState<"password" | "otp">("password");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim() && password.trim()) {
      onPasswordSignIn(identifier.trim(), password.trim());
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim() && identifier.includes("@")) {
      onEmailSignIn(identifier.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={signInMode === "password" ? "default" : "outline"}
          size="sm"
          onClick={() => setSignInMode("password")}
          className="flex-1"
        >
          <Key className="mr-2 h-4 w-4" />
          Password
        </Button>
        <Button
          type="button"
          variant={signInMode === "otp" ? "default" : "outline"}
          size="sm"
          onClick={() => setSignInMode("otp")}
          className="flex-1"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email OTP
        </Button>
      </div>

      {signInMode === "password" ? (
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
          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={onForgotPassword}
              className="px-0 h-auto"
            >
              Forgot password?
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !identifier.trim() || !password.trim()}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !identifier.trim()}>
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
      )}
    </div>
  );
}

function ForgotPasswordForm({ 
  onSubmit, 
  onBack,
  isLoading 
}: { 
  onSubmit: (identifier: string) => void;
  onBack: () => void;
  isLoading: boolean;
}) {
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      onSubmit(identifier.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Reset Password</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email Address</Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="Enter your email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !identifier.trim()}
            className="flex-1"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}