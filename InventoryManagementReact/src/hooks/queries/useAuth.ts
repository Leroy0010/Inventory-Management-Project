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
        logout,
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
            clearUser();
            logout();
            queryClient.clear();
        },
        onError: () => {
            // Even if logout fails on server, clear local state

            clearUser();
            logout();
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

    // Verify 2FA mutation
    const verify2FAMutation = useMutation({
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

    // Resend OTP mutation
    const resendOtpMutation = useMutation({
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
        verify2FAMutation,
        resendOtpMutation,
    };
}
