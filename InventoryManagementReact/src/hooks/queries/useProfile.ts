import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { useAuthStore } from '@/stores/authStore';
import { getErrorMessage } from '@/lib/error-utils';
import { passwordErrorHandler } from '@/lib/passwordErrorHandler';
import type {
    UpdateProfileRequest,
    UpdatePasswordRequest,
} from '@/types/profile';

const PROFILE_QUERY_KEY = 'profile';

// Get current user profile
export const useGetProfile = () => {
    return useQuery({
        queryKey: [PROFILE_QUERY_KEY],
        queryFn: () => profileApi.getProfile(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

// Update user profile
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { setError } = useAuthStore();

    return useMutation({
        mutationFn: (data: UpdateProfileRequest) =>
            profileApi.updateProfile(data),
        onSuccess: (updatedProfile) => {
            // Update the profile query cache
            queryClient.setQueryData([PROFILE_QUERY_KEY], updatedProfile);

            // Update the auth store with new user data
            queryClient.invalidateQueries({ queryKey: ['auth'] });

            setError(null);
        },
        onError: (err) => {
            setError({ type: 'API', message: getErrorMessage(err) });
        },
    });
};

// Change user password
export const useChangePassword = () => {
    const queryClient = useQueryClient();
    const { setError } = useAuthStore();

    return useMutation({
        mutationFn: (data: UpdatePasswordRequest) =>
            profileApi.changePassword(data),
        onSuccess: () => {
            // Invalidate auth queries to refresh user data
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            setError(null);

            // Show success toast
            passwordErrorHandler.success({
                operation: 'change',
            });
        },
        onError: (err) => {
            setError({ type: 'API', message: getErrorMessage(err) });

            // Show error toast with context
            passwordErrorHandler.changePassword(err);
        },
    });
};

// Combined profile queries hook
export const useProfileQueries = () => ({
    getProfile: useGetProfile(),
    updateProfile: useUpdateProfile(),
    changePassword: useChangePassword(),
});
