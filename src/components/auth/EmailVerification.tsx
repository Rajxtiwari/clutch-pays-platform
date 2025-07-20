import { useState } from 'react';
import { useAuth, useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function EmailVerification() {
  const { user } = useAuth();
  const { signIn } = useAuthActions();
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      // This will trigger the sendVerificationRequest on the backend
      await signIn('email-otp', { email: user.email });
      setOtpSent(true);
      toast.success('Verification code sent to your email.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      await signIn('email-otp', { email: user.email, token: otpCode });
      toast.success('Email verified successfully!');
      // Optionally, you can trigger a re-fetch of user data here if the UI doesn't update automatically
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Verify your email to secure your account and unlock more features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!otpSent ? (
          <Button onClick={handleSendOtp} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleVerifyOtp} disabled={isLoading || otpCode.length < 6}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Your email: {user?.email}
        </p>
      </CardContent>
    </Card>
  );
}