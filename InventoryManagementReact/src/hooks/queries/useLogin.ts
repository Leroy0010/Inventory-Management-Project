import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import type { LoginRequest, User } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { authKeys } from './authKeys';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

export function useLogin() {
    const queryClient = useQueryClient();
    const { setUser, setError, clearError } = useAuthStore();

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
        onSuccess: (data) => {
            // Check if response indicates 2FA is required
            if (
                data &&
                typeof data === 'object' &&
                'requiresTwoFactor' in data
            ) {
                // Return the 2FA response as-is for the component to handle
                return data;
            }

            // Normal login successful - data is User type
            const user = data as User;
            setUser(user);
            clearError();
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
            return user;
        },
        onError: (error) => {
            console.error('Login mutation onError called:', error);
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            let errorMessage = friendlyMessage;
            if (validationErrors.length > 0) {
                errorMessage += ': ' + validationErrors.join(', ');
            }

            setError({ type: 'LOGIN', message: errorMessage });
        },
    });
}
