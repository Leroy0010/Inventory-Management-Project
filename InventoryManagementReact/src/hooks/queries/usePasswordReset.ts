import { useMutation } from '@tanstack/react-query';
import { passwordResetApi } from '@/api/passwordReset';
import type {
    PasswordResetRequest,
    PasswordChangeRequest,
    PasswordResetResponse,
    PasswordChangeResponse,
} from '@/types/passwordReset';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';
import { toast } from 'sonner';

// Hook for requesting password reset
export function useRequestPasswordReset() {
    return useMutation<PasswordResetResponse, Error, PasswordResetRequest>({
        mutationFn: passwordResetApi.requestPasswordReset,
        onError: (error: any) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(
                    `Failed to send password reset email: ${friendlyMessage}`,
                    {
                        description: validationErrors.join(', '),
                    }
                );
            } else {
                toast.error(
                    `Failed to send password reset email: ${friendlyMessage}`
                );
            }
        },
    });
}

// Hook for resetting password with token
export function useResetPassword() {
    return useMutation<PasswordChangeResponse, Error, PasswordChangeRequest>({
        mutationFn: passwordResetApi.resetPassword,
        onError: (error: any) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to reset password: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to reset password: ${friendlyMessage}`);
            }
        },
    });
}

// Combined hook for password reset operations
export function usePasswordResetQueries() {
    const requestPasswordReset = useRequestPasswordReset();
    const resetPassword = useResetPassword();

    return {
        requestPasswordReset,
        resetPassword,
    };
}
