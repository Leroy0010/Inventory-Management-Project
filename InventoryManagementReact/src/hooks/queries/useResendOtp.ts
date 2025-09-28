import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

export function useResendOtp() {
    const { clearError, setError } = useAuthStore();

    return useMutation({
        mutationFn: ({ email }: { email: string }) =>
            authApi.resendOtp({ email }),
        onSuccess: () => {
            clearError();
        },
        onError: (error) => {
            console.error('Resend OTP error:', error);
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            let errorMessage = friendlyMessage;
            if (validationErrors.length > 0) {
                errorMessage += ': ' + validationErrors.join(', ');
            }

            setError({ type: 'API', message: errorMessage });
        },
    });
}
