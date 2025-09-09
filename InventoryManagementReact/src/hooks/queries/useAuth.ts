import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import type { LoginRequest } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { DEV_CONFIG } from '@/config/dev';

// Query Keys
export const authKeys = {
    all: ['auth'] as const,
    profile: () => [...authKeys.all, 'profile'] as const,
    refresh: () => [...authKeys.all, 'refresh'] as const,
};

// Custom hook for authentication queries and mutations
export function useAuthQueries() {
    const queryClient = useQueryClient();
    const { setUser, clearTokens, setError, clearError } = useAuthStore();

    // Get current user profile
    const profileQuery = useQuery({
        queryKey: authKeys.profile(),
        queryFn: authApi.getProfile,
        enabled: !DEV_CONFIG.BYPASS_AUTH,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
        onSuccess: (data) => {
            setUser(data.user);
            // Note: Tokens are handled by HTTP-only cookies in this implementation
            // If you need to store tokens in state, uncomment the following:
            // setTokens(data.token, data.refreshToken);
            clearError();
            // Invalidate and refetch profile
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        },
        onError: (error) => {
            setError(error instanceof Error ? error.message : 'Login failed');
        },
    });

    // Google login mutation
    const googleLoginMutation = useMutation({
        mutationFn: (token: string) => authApi.loginWithGoogle(token),
        onSuccess: (data) => {
            setUser(data.user);
            // Note: Tokens are handled by HTTP-only cookies in this implementation
            // If you need to store tokens in state, uncomment the following:
            // setTokens(data.token, data.refreshToken);
            clearError();
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        },
        onError: (error) => {
            setError(error instanceof Error ? error.message : 'Google login failed');
        },
    });

    // Refresh token mutation
    const refreshMutation = useMutation({
        mutationFn: authApi.refresh,
        onSuccess: (data) => {
            setUser(data.user);
            // Note: Tokens are handled by HTTP-only cookies in this implementation
            // If you need to store tokens in state, uncomment the following:
            // setTokens(data.token, data.refreshToken);
            clearError();
        },
        onError: () => {
            clearTokens();
            setUser(null);
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearTokens();
            setUser(null);
            queryClient.clear();
        },
        onError: () => {
            // Even if logout fails on server, clear local state
            clearTokens();
            setUser(null);
            queryClient.clear();
        },
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: authApi.updateProfile,
        onSuccess: (data) => {
            setUser(data);
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        },
        onError: (error) => {
            setError(error instanceof Error ? error.message : 'Profile update failed');
        },
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
            authApi.changePassword(currentPassword, newPassword),
        onSuccess: () => {
            clearError();
        },
        onError: (error) => {
            setError(error instanceof Error ? error.message : 'Password change failed');
        },
    });

    // Request password reset mutation
    const requestPasswordResetMutation = useMutation({
        mutationFn: (email: string) => authApi.requestPasswordReset(email),
        onSuccess: () => {
            clearError();
        },
        onError: (error) => {
            setError(error instanceof Error ? error.message : 'Password reset request failed');
        },
    });

    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
            authApi.resetPassword(token, newPassword),
        onSuccess: () => {
            clearError();
        },
        onError: (error) => {
            setError(error instanceof Error ? error.message : 'Password reset failed');
        },
    });

    return {
        // Queries
        profileQuery,
        
        // Mutations
        loginMutation,
        googleLoginMutation,
        refreshMutation,
        logoutMutation,
        updateProfileMutation,
        changePasswordMutation,
        requestPasswordResetMutation,
        resetPasswordMutation,
    };
}
