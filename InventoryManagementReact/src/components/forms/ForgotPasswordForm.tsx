import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useRequestPasswordReset } from '@/hooks/queries/usePasswordReset';
import type { ForgotPasswordFormData } from '@/types/passwordReset';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';

// Validation schema
const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
});

interface ForgotPasswordFormProps {
    onSuccess?: (email: string) => void;
    onBack?: () => void;
    className?: string;
}

export function ForgotPasswordForm({
    onSuccess,
    onBack,
    className,
}: ForgotPasswordFormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const requestPasswordReset = useRequestPasswordReset();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const email = watch('email');

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await requestPasswordReset.mutateAsync(data);
            setIsSubmitted(true);
            onSuccess?.(data.email);
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    const handleResend = async () => {
        if (email) {
            try {
                await requestPasswordReset.mutateAsync({ email });
            } catch (error) {
                // Error is handled by the mutation
            }
        }
    };

    if (isSubmitted) {
        return (
            <Card className={className}>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Check Your Email</CardTitle>
                    <CardDescription>
                        We've sent a password reset link to{' '}
                        <strong>{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertDescription>
                            If you don't see the email in your inbox, please
                            check your spam folder. The link will expire in 15
                            minutes.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <Button
                            onClick={handleResend}
                            disabled={requestPasswordReset.isPending}
                            variant="outline"
                            className="w-full"
                        >
                            {requestPasswordReset.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Resend Email'
                            )}
                        </Button>

                        <Button
                            onClick={() => {
                                setIsSubmitted(false);
                                onBack?.();
                            }}
                            variant="ghost"
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Forgot Password?</CardTitle>
                <CardDescription>
                    Enter your email address and we'll send you a link to reset
                    your password.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Error Alert */}
                {requestPasswordReset.error && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            <FormErrorAlert
                                error={requestPasswordReset.error}
                                defaultMessage="Failed to send password reset email. Please try again."
                            />
                        </AlertDescription>
                    </Alert>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            {...register('email')}
                            disabled={
                                isSubmitting || requestPasswordReset.isPending
                            }
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={
                            isSubmitting || requestPasswordReset.isPending
                        }
                    >
                        {isSubmitting || requestPasswordReset.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending Reset Link...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </Button>
                </form>

                <div className="text-center">
                    <Button onClick={onBack} variant="link" className="text-sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
