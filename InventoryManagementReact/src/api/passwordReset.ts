import apiClient from './client';
import type {
    PasswordResetRequest,
    PasswordResetResponse,
    PasswordChangeRequest,
    PasswordChangeResponse,
} from '@/types/passwordReset';

export const passwordResetApi = {
    // Request password reset
    requestPasswordReset: async (
        data: PasswordResetRequest
    ): Promise<PasswordResetResponse> => {
        const response = await apiClient.post('/auth/forgot-password', data);
        return response.data;
    },

    // Reset password with token
    resetPassword: async (
        data: PasswordChangeRequest
    ): Promise<PasswordChangeResponse> => {
        const response = await apiClient.post('/auth/reset-password', data);
        return response.data;
    },
};
