import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { SignupForm } from "./SignupForm";
import { TermsAcceptance } from "./TermsAcceptance";
import { useNavigate } from "react-router";

type AuthStep = "signin" | "signup" | "terms" | "otp" | "forgot";

interface SignupData {
  email: string;
  username: string;
  password: string;
  dateOfBirth: string;
}

export function AuthCard() {
  const [step, setStep] = useState<AuthStep>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  
  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const { signIn } = useAuthActions();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    await signIn("google");
    navigate("/dashboard");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("password", {
        email: signInData.email,
        password: signInData.password,
        flow: "signIn",
      });
      
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupComplete = (data: SignupData) => {
    setSignupData(data);
    setStep("terms");
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
      
      setStep("otp");
      toast.success("Account created! Please verify your email.");
    } catch (error: any) {
      toast.error(error.message || "Account creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("email-otp", {
        email: signupData?.email || "",
        token: otpCode,
      });
      
      toast.success("Email verified! Welcome to Clutch Pays!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send password reset email
      await signIn("email-otp", {
        email: forgotEmail,
      });
      
      toast.success("Password reset link sent to your email!");
      setStep("signin");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const SignInForm = () => (
    <motion.form
      onSubmit={handleSignIn}
      className="space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={signInData.email}
            onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={signInData.password}
            onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          className="px-0 text-sm"
          onClick={() => setStep("forgot")}
        >
          Forgot password?
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative my-4">
        <Separator />
        <div className="absolute inset-0 flex items-center">
          <span className="mx-auto bg-card px-2 text-sm text-muted-foreground">
            OR
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        Sign in with Google
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={() => setStep("signup")}
          disabled={isLoading}
        >
          Don't have an account? Sign up
        </Button>
      </div>
    </motion.form>
  );

  const ForgotPasswordForm = () => (
    <motion.form
      onSubmit={handleForgotPassword}
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="forgot-email"
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          We'll send you a link to reset your password.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setStep("signin")}
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sign In
      </Button>
    </motion.form>
  );

  const OtpForm = () => (
    <motion.form
      onSubmit={handleOtpVerify}
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Verify Your Email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a verification code to {signupData?.email}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter 6-digit code"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          maxLength={6}
          className="text-center text-lg tracking-widest"
          required
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || otpCode.length !== 6}>
        {isLoading ? "Verifying..." : "Verify Email"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setStep("signup")}
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sign Up
      </Button>
    </motion.form>
  );

  const getTitle = () => {
    switch (step) {
      case "signin": return "Welcome Back";
      case "signup": return "Create Account";
      case "terms": return "Terms & Conditions";
      case "otp": return "Email Verification";
      case "forgot": return "Reset Password";
      default: return "Authentication";
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case "signin": return "Sign in to your Clutch Pays account";
      case "signup": return "Join thousands of skilled players";
      case "terms": return "Please accept our terms to continue";
      case "otp": return "Verify your email to complete registration";
      case "forgot": return "Enter your email to reset your password";
      default: return "";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
        <p className="text-muted-foreground">{getSubtitle()}</p>
      </CardHeader>
      
      <CardContent>
        {step === "signin" && <SignInForm />}
        {step === "signup" && (
          <SignupForm 
            onComplete={handleSignupComplete}
            isLoading={isLoading}
          />
        )}
        {step === "terms" && (
          <TermsAcceptance
            onAccept={handleTermsAccept}
            onBack={() => setStep("signup")}
            isLoading={isLoading}
          />
        )}
        {step === "otp" && <OtpForm />}
        {step === "forgot" && <ForgotPasswordForm />}
      </CardContent>
    </Card>
  );
}