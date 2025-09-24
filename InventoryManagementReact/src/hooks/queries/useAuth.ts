import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import type { LoginRequest, User } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

// Query Keys
export const authKeys = {
    all: ['auth'] as const,
    profile: () => [...authKeys.all, 'profile'] as const,
    refresh: () => [...authKeys.all, 'refresh'] as const,
};

// Custom hook for authentication queries and mutations
export function useAuthQueries() {
    const queryClient = useQueryClient();
    const {
        setUser,
        setUserFromProfile,
        clearUser,
        setError,
        clearError,
        logout
    } = useAuthStore();

    // Get current user profile
    const profileQuery = useQuery({
        queryKey: authKeys.profile(),
        queryFn: authApi.getProfile,
        enabled: false, // Don't auto-fetch on mount
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
        onSuccess: (data) => {
            const user: User = {
                id: data.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.fullName,
                fullName: data.firstName,
                role: data.role,
            };
            setUser(user);
            clearError();
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
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


    // Refresh token mutation
    const refreshMutation = useMutation({
        mutationFn: authApi.refresh,
        onSuccess: (data) => {
            if (data) {
                setUser({
                    id: data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    fullName: data.fullName,
                    role: data.role,
                });
            }
            clearError();
        },
        onError: () => {
            clearUser();
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearUser()
            queryClient.clear();
        },
        onError: () => {
            // Even if logout fails on server, clear local state
            
            clearUser()
            logout()
            queryClient.clear();
        },
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: authApi.updateProfile,
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

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: ({
            currentPassword,
            newPassword,
        }: {
            currentPassword: string;
            newPassword: string;
        }) => authApi.changePassword(currentPassword, newPassword),
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

    // Request password reset mutation
    const requestPasswordResetMutation = useMutation({
        mutationFn: (email: string) => authApi.requestPasswordReset(email),
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

            setError({ type: 'LOGIN', message: errorMessage });
        },
    });

    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: ({
            token,
            newPassword,
        }: {
            token: string;
            newPassword: string;
        }) => authApi.resetPassword(token, newPassword),
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

    return {
        // Queries
        profileQuery,

        // Mutations
        loginMutation,
        refreshMutation,
        logoutMutation,
        updateProfileMutation,
        changePasswordMutation,
        requestPasswordResetMutation,
        resetPasswordMutation,
    };
}
