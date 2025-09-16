import { api, handleApiError } from './client';
import type {
    LoginRequest,
    LoginResponse,
    RefreshResponse,
    User,
} from '@/types/auth';

// Auth API functions
export const authApi = {
    // Login with email and password
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            return await api.post<LoginResponse>(
                '/api/auth/login',
                credentials
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Login with Google
    loginWithGoogle: async (googleToken: string): Promise<LoginResponse> => {
        try {
            return await api.post<LoginResponse>('/api/auth/google', {
                token: googleToken,
            });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Refresh authentication token
    refresh: async (): Promise<RefreshResponse> => {
        try {
            return await api.post<RefreshResponse>('/api/auth/refresh');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Logout
    logout: async (): Promise<void> => {
        try {
            await api.post('/api/auth/logout');
        } catch (error) {
            // Don't throw error for logout, just log it
            // Logout error
        }
    },

    // Get current user profile
    getProfile: async (): Promise<User> => {
        try {
            return await api.get<User>('/api/user/profile');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Update user profile
    updateProfile: async (updates: Partial<User>): Promise<User> => {
        try {
            return await api.put<User>('/api/user/profile', updates);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Change password
    changePassword: async (
        currentPassword: string,
        newPassword: string
    ): Promise<void> => {
        try {
            await api.put('/api/user/change-password', {
                currentPassword,
                newPassword,
            });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Request password reset
    requestPasswordReset: async (email: string): Promise<void> => {
        try {
            await api.post('/api/auth/forgot-password', { email });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Reset password
    resetPassword: async (
        token: string,
        newPassword: string
    ): Promise<void> => {
        try {
            await api.post('/api/auth/reset-password', {
                token,
                newPassword,
            });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
