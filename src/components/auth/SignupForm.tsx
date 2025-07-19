import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";

interface SignupData {
  email: string;
  username: string;
  password: string;
  dateOfBirth: string;
}

interface SignupFormProps {
  onComplete: (data: SignupData) => void;
  isLoading?: boolean;
}

export function SignupForm({ onComplete, isLoading = false }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    username: "",
    password: "",
    dateOfBirth: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupData>>({});

  // Debounced values for API calls
  const debouncedUsername = useDebounce(formData.username, 500);
  const debouncedEmail = useDebounce(formData.email, 500);
  
  // Real-time validation queries
  const usernameCheck = useQuery(
    api.userValidation.checkUsernameAvailability,
    debouncedUsername.length >= 3 ? { username: debouncedUsername } : "skip"
  );
  
  const emailCheck = useQuery(
    api.userValidation.checkEmailAvailability,
    debouncedEmail.includes("@") ? { email: debouncedEmail } : "skip"
  );

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    return { strength: (strength / 5) * 100, checks };
  };

  const { strength, checks } = calculatePasswordStrength(formData.password);

  // Age validation
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateForm = () => {
    const newErrors: Partial<SignupData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (emailCheck && !emailCheck.available) {
      newErrors.email = emailCheck.message;
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    } else if (usernameCheck && !usernameCheck.available) {
      newErrors.username = usernameCheck.message;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        newErrors.dateOfBirth = "You must be 18 years or older to register";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && usernameCheck?.available && emailCheck?.available) {
      onComplete(formData);
    }
  };

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getStrengthColor = () => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength < 40) return "Weak";
    if (strength < 70) return "Medium";
    return "Strong";
  };

  const isFormValid = usernameCheck?.available && emailCheck?.available && strength >= 40;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : emailCheck?.available ? "border-green-500" : ""}
            />
            {debouncedEmail.includes("@") && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {emailCheck === undefined ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : emailCheck.available ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {errors.email ? (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.email}
            </p>
          ) : emailCheck && !emailCheck.available ? (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {emailCheck.message}
            </p>
          ) : emailCheck?.available ? (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {emailCheck.message}
            </p>
          ) : null}
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={isLoading}
              className={errors.username ? "border-red-500" : usernameCheck?.available ? "border-green-500" : ""}
            />
            {debouncedUsername.length >= 3 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {usernameCheck === undefined ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : usernameCheck.available ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {errors.username ? (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.username}
            </p>
          ) : usernameCheck && !usernameCheck.available ? (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {usernameCheck.message}
            </p>
          ) : usernameCheck?.available ? (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {usernameCheck.message}
            </p>
          ) : null}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isLoading}
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Password strength:</span>
                <span className={`text-sm font-medium ${
                  strength < 40 ? "text-red-500" : 
                  strength < 70 ? "text-yellow-500" : "text-green-500"
                }`}>
                  {getStrengthText()}
                </span>
              </div>
              <Progress value={strength} className="h-2" />
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className={`flex items-center gap-1 ${checks.length ? "text-green-600" : "text-muted-foreground"}`}>
                  {checks.length ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  8+ characters
                </div>
                <div className={`flex items-center gap-1 ${checks.uppercase ? "text-green-600" : "text-muted-foreground"}`}>
                  {checks.uppercase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  Uppercase
                </div>
                <div className={`flex items-center gap-1 ${checks.lowercase ? "text-green-600" : "text-muted-foreground"}`}>
                  {checks.lowercase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  Lowercase
                </div>
                <div className={`flex items-center gap-1 ${checks.number ? "text-green-600" : "text-muted-foreground"}`}>
                  {checks.number ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  Number
                </div>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Date of Birth Field */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            disabled={isLoading}
            className={errors.dateOfBirth ? "border-red-500" : ""}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          />
          {formData.dateOfBirth && (
            <p className="text-sm text-muted-foreground">
              Age: {calculateAge(formData.dateOfBirth)} years old
            </p>
          )}
          {errors.dateOfBirth && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? "Processing..." : "Continue to Terms & Conditions"}
        </Button>
      </form>
    </motion.div>
  );
}