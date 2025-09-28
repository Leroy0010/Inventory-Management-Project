import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { authKeys } from './authKeys';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

export function useVerify2FA() {
    const queryClient = useQueryClient();
    const { setUser, clearError, setError } = useAuthStore();

    return useMutation({
        mutationFn: async ({
            email,
            otp,
            onSuccess,
        }: {
            email: string;
            otp: string;
            onSuccess: () => void;
        }) => {
            const response = await authApi.verifyTwoFactor({
                email,
                otp,
            });
            return response;
        },
        onSuccess: async (data, variables) => {
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

                    variables.onSuccess();
                } catch (error) {
                    console.error(
                        'Failed to fetch user profile after 2FA:',
                        error
                    );
                    // Still call onSuccess as the user is authenticated
                    variables.onSuccess();
                }
            }
        },
        onError: (error) => {
            console.error('2FA verification error:', error);
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
