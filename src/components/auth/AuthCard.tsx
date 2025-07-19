import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { GamepadIcon, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SignupForm } from "./SignupForm";
import { TermsAcceptance } from "./TermsAcceptance";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface SignupData {
  email: string;
  username: string;
  password: string;
  dateOfBirth: string;
}

interface AuthCardProps {
  onAuthSuccess?: () => void;
}

export function AuthCard() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [signupStep, setSignupStep] = useState<"form" | "terms" | "otp">("form");
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    username: "",
    password: "",
    dateOfBirth: "",
  });
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [otpCode, setOtpCode] = useState("");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

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
      // Send OTP to email
      await signIn("email-otp", {
        email: signupData.email,
        flow: "signUp"
      });
      
      setSignupStep("otp");
      toast.success("Verification code sent to your email!");
      
    } catch (error: any) {
      console.error("OTP send error:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP and create account
      await signIn("email-otp", {
        email: signupData.email,
        code: otpCode,
        flow: "signUp"
      });

      // Update user profile with signup data
      await signIn("password", {
        email: signupData.email,
        password: signupData.password,
        flow: "signUp",
        name: signupData.username,
        username: signupData.username,
        dateOfBirth: signupData.dateOfBirth,
      });
      
      toast.success("Account created successfully! Welcome to Clutch Pays!");
      
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setSignupStep("form");
  };

  const handleBackToTerms = () => {
    setSignupStep("terms");
  };

  // OTP Verification Step
  if (signupStep === "otp") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <p className="text-muted-foreground">
              We've sent a 6-digit code to <br />
              <span className="font-medium">{signupData.email}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleOtpVerification}
                disabled={isLoading || otpCode.length !== 6}
                className="w-full"
              >
                {isLoading ? "Verifying..." : "Verify & Create Account"}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleBackToTerms}
                disabled={isLoading}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Terms
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => handleTermsAccept()}
                disabled={isLoading}
                className="text-sm"
              >
                Didn't receive code? Resend
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Terms Step
  if (signupStep === "terms") {
    return (
      <TermsAcceptance
        onAccept={handleTermsAccept}
        onBack={handleBackToForm}
        isLoading={isLoading}
      />
    );
  }

  // Main Auth Form
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
            <img src="/assets/logo.png" alt="Clutch Pays" className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome to Clutch Pays</h1>
        <p className="text-muted-foreground mt-2">
          Join the ultimate skill-based gaming platform
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("signin")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "signin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "signup"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Content Area with Fixed Height */}
      <div className="min-h-[400px] max-h-[60vh] overflow-y-auto">
        {activeTab === "signin" ? (
          <SignInForm />
        ) : signupStep === "form" ? (
          <SignupForm onComplete={handleSignupComplete} isLoading={isLoading} />
        ) : signupStep === "terms" ? (
          <TermsAcceptance 
            onAccept={handleTermsAccept} 
            onBack={() => setSignupStep("form")}
            isLoading={isLoading}
          />
        ) : signupStep === "otp" ? (
          <OtpVerification />
        ) : (
          <AccountCreated />
        )}
      </div>
    </div>
  );
}

function SignInForm() {
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