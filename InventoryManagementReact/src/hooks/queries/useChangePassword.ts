import { useMutation } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { useAuthStore } from '@/stores/authStore';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

export function useChangePassword() {
    const { clearError, setError } = useAuthStore();

    return useMutation({
        mutationFn: ({
            currentPassword,
            newPassword,
        }: {
            currentPassword: string;
            newPassword: string;
        }) =>
            profileApi.changePassword({
                oldPassword: currentPassword,
                newPassword,
                confirmPassword: newPassword,
            }),
        onSuccess: () => {
            clearError();
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
