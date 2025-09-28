import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import type { UserProfile } from '@/types/profile';
import { useAuthStore } from '@/stores/authStore';
import { authKeys } from './authKeys';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { setUserFromProfile, setError } = useAuthStore();

    return useMutation({
        mutationFn: profileApi.updateProfile,
        onSuccess: (data) => {
            setUserFromProfile(data);
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        },
        onError: (error) => {
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
