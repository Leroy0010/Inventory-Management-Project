import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { authKeys } from '@/hooks/queries/useAuth';

interface TwoFactorVerificationProps {
    email: string;
    onBack: () => void;
    onSuccess: () => void;
    className?: string;
}

export function TwoFactorVerification({
    email,
    onBack,
    onSuccess,
    className,
}: TwoFactorVerificationProps) {
    const [otp, setOtp] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();
    const { error, clearError, setUser } = useAuthStore();
    const queryClient = useQueryClient();

    // Verify 2FA mutation
    const verify2FAMutation = useMutation({
        mutationFn: async (otpCode: string) => {
            const response = await authApi.verifyTwoFactor({
                email,
                otp: otpCode,
            });
            return response;
        },
        onSuccess: async (data) => {
            if (data.success) {
                // The JWT token is set as HTTP-only cookie by the backend
                // Now we need to fetch the user profile to set the auth state
                try {
                    const userProfile = await authApi.getProfile();
                    setUser(userProfile);
                    clearError();
                    queryClient.invalidateQueries({
                        queryKey: authKeys.profile(),
                    });

                    // Add a small delay to ensure all operations complete
                    await new Promise((resolve) => setTimeout(resolve, 200));

                    onSuccess();
                } catch (error) {
                    console.error(
                        'Failed to fetch user profile after 2FA:',
                        error
                    );
                    // Still call onSuccess as the user is authenticated
                    onSuccess();
                }
            }
        },
        onError: (error) => {
            console.error('2FA verification error:', error);
        },
    });

    // Resend OTP mutation
    const resendOtpMutation = useMutation({
        mutationFn: async () => {
            const response = await authApi.resendOtp({ email });
            return response;
        },
        onSuccess: () => {
            setIsResending(false);
            setResendCooldown(60); // 60 seconds cooldown
        },
        onError: (error) => {
            console.error('Resend OTP error:', error);
            setIsResending(false);
        },
    });

    // Handle OTP verification
    const handleVerifyOtp = async (otpCode: string) => {
        if (otpCode.length === 6) {
            clearError();
            await verify2FAMutation.mutateAsync(otpCode);
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);
        clearError();
        await resendOtpMutation.mutateAsync();
    };

    // Cooldown timer effect
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Auto-submit when OTP is complete
    useEffect(() => {
        if (otp.length === 6) {
            handleVerifyOtp(otp);
        }
    }, [otp]);

    return (
        <Card className={className}>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                    Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                    We've sent a 6-digit verification code to
                    <br />
                    <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Error Alert */}
                {(error || verify2FAMutation.error) && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            <FormErrorAlert
                                error={verify2FAMutation.error || error}
                                defaultMessage="Verification failed. Please try again."
                            />
                        </AlertDescription>
                    </Alert>
                )}

                {/* OTP Input */}
                <div className="space-y-4">
                    <Label htmlFor="otp" className="text-center block">
                        Enter verification code
                    </Label>

                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={setOtp}
                            disabled={verify2FAMutation.isPending}
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

                {/* Verify Button */}
                <Button
                    onClick={() => handleVerifyOtp(otp)}
                    disabled={otp.length !== 6 || verify2FAMutation.isPending}
                    className="w-full"
                >
                    {verify2FAMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Verify Code'
                    )}
                </Button>

                {/* Resend OTP */}
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the code?
                    </p>
                    <Button
                        variant="link"
                        onClick={handleResendOtp}
                        disabled={isResending || resendCooldown > 0}
                        className="text-sm"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : resendCooldown > 0 ? (
                            `Resend in ${resendCooldown}s`
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Resend Code
                            </>
                        )}
                    </Button>
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        disabled={verify2FAMutation.isPending}
                        className="text-sm"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Button>
                </div>

                {/* Help Text */}
                <div className="text-center text-xs text-muted-foreground">
                    <p>
                        Check your email inbox and spam folder.
                        <br />
                        The code will expire in 5 minutes.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
