import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { validatePasswordStrength } from '@/lib/password-utils';
import type { ResetPasswordFormData } from './ResetPasswordFormValidation';

interface ResetPasswordFormActionsProps {
    isSubmitting: boolean;
    isPending: boolean;
    onBack: () => void;
}

export function ResetPasswordFormActions({
    isSubmitting,
    isPending,
    onBack,
}: ResetPasswordFormActionsProps) {
    const { watch } = useFormContext<ResetPasswordFormData>();
    const newPassword = watch('newPassword');
    const passwordStrength = validatePasswordStrength(newPassword || '');

    return (
        <div className="space-y-4">
            <Button
                type="submit"
                className="w-full"
                disabled={
                    isSubmitting ||
                    isPending ||
                    passwordStrength === 'Very Weak'
                }
            >
                {isSubmitting || isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                    </>
                ) : (
                    'Reset Password'
                )}
            </Button>

            <div className="text-center">
                <Button onClick={onBack} variant="link" className="text-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Button>
            </div>
        </div>
    );
}
