import { useMutation } from '@tanstack/react-query';
import { passwordResetApi } from '@/api/passwordReset';
import type {
    PasswordResetRequest,
    PasswordChangeRequest,
    PasswordResetResponse,
    PasswordChangeResponse,
} from '@/types/passwordReset';
import { passwordErrorHandler } from '@/lib/passwordErrorHandler';

// Hook for requesting password reset
export function useRequestPasswordReset() {
    return useMutation<PasswordResetResponse, Error, PasswordResetRequest>({
        mutationFn: passwordResetApi.requestPasswordReset,
        onSuccess: () => {
            passwordErrorHandler.success({
                operation: 'reset',
            });
        },
        onError: (error: any) => {
            passwordErrorHandler.resetPassword(error);
        },
    });
}

// Hook for resetting password with token
export function useResetPassword() {
    return useMutation<PasswordChangeResponse, Error, PasswordChangeRequest>({
        mutationFn: passwordResetApi.resetPassword,
        onSuccess: () => {
            passwordErrorHandler.success({
                operation: 'reset',
            });
        },
        onError: (error: any) => {
            passwordErrorHandler.resetPassword(error);
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
