import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';
import { useResetPassword } from '@/hooks/queries/usePasswordReset';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
    resetPasswordSchema,
    type ResetPasswordFormData,
} from './ResetPasswordFormValidation';
import { ResetPasswordFormSuccess } from './ResetPasswordFormSuccess';
import { ResetPasswordFormFields } from './ResetPasswordFormFields';
import { ResetPasswordFormActions } from './ResetPasswordFormActions';

interface ResetPasswordFormProps {
    token: string;
    onSuccess?: () => void;
    onBack?: () => void;
    className?: string;
}

export default function ResetPasswordForm({
    token,
    onSuccess,
    onBack,
    className,
}: ResetPasswordFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const resetPassword = useResetPassword();

    const methods = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            await resetPassword.mutateAsync({
                token,
                newPassword: data.newPassword,
            });
            setIsSuccess(true);
            setTimeout(() => onSuccess?.(), 3000);
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    if (isSuccess) {
        return (
            <ResetPasswordFormSuccess
                onBack={onBack || (() => {})}
                className={className}
            />
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                <CardDescription>
                    Enter your new password below.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Error Alert */}
                {resetPassword.error && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            <FormErrorAlert
                                error={resetPassword.error}
                                defaultMessage="Failed to reset password. Please try again."
                            />
                        </AlertDescription>
                    </Alert>
                )}

                {/* Form */}
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <ResetPasswordFormFields
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}
                            isSubmitting={isSubmitting}
                            isPending={resetPassword.isPending}
                        />

                        <ResetPasswordFormActions
                            isSubmitting={isSubmitting}
                            isPending={resetPassword.isPending}
                            onBack={onBack || (() => {})}
                        />
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
