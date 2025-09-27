import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthQueries } from '@/hooks/queries/useAuth';
import OtpHeader from './OtpHeader';
import OtpInput from './OtpInput';

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
    const { error, clearError } = useAuthStore();
    const { verify2FAMutation, resendOtpMutation } = useAuthQueries();

    // Handle OTP verification
    const handleVerifyOtp = async (otpCode: string) => {
        if (otpCode.length === 6) {
            clearError();
            await verify2FAMutation.mutateAsync({
                email,
                otp: otpCode,
                onSuccess,
            });
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);
        clearError();
        try {
            await resendOtpMutation.mutateAsync({ email });
            setIsResending(false);
            setResendCooldown(60); // 60 seconds cooldown
        } catch (error) {
            setIsResending(false);
        }
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
            <OtpHeader email={email} />

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
                <OtpInput
                    otp={email}
                    setOtp={setOtp}
                    verify2FAMutation={verify2FAMutation}
                />

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
