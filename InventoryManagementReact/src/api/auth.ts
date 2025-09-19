import { userProfileToUser } from '@/lib/auth-utils';
import { api, handleApiError } from './client';
import type { LoginRequest, User } from '@/types/auth';
import type { UserProfile } from '@/types/profile';


// Response type from backend for login/google/refresh
// (note: no accessToken anymore, only user)
interface BackendAuthResponse {
    id: number;
    email: string;
    firstName: string;
    role: string;
    lastName: string;
}

// Auth API functions
export const authApi = {
  // Login with email and password
  login: async (credentials: LoginRequest): Promise<User> => {
    try {
      const response = await api.post<BackendAuthResponse>('/auth/login', credentials, {
        withCredentials: true, // send/receive cookies
      });
      return mapBackendUser(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },


  // Refresh authentication token (issues new cookie)
  refresh: async (): Promise<User> => {
    try {
      const response = await api.post<BackendAuthResponse>(
        '/auth/refresh',
        {},
        { withCredentials: true }
      );
      return mapBackendUser(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch {
      // don’t throw, just ignore
    }
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      
        
        const profile = await api.get<UserProfile>('/users/get-profile', {
        withCredentials: true,
      });
      return userProfileToUser(profile);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update user profile
  updateProfile: async (
    updates: Partial<UserProfile>
  ): Promise<UserProfile> => {
    try {
      return await api.put<UserProfile>('/users/update-profile', updates, {
        withCredentials: true,
      });
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
      await api.post(
        '/users/change-password',
        { currentPassword, newPassword },
        { withCredentials: true }
      );
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
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
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// --- Helper to map backend response ---
function mapBackendUser(response: BackendAuthResponse): User {
  return {
    id: response.id,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    fullName: `${response.firstName} ${response.lastName} `, // adjust if backend sends lastName
    role: response.role as 'ADMIN' | 'STOREKEEPER' | 'STAFF',
  };
}
