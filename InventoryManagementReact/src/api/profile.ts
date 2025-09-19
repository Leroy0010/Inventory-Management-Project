import apiClient from './client';
import type { 
  UserProfile, 
  UpdateProfileRequest, 
  UpdatePasswordRequest, 
  UpdatePasswordResponse 
} from '@/types/profile';

export const profileApi = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/users/get-profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/users/update-profile', data);
    return response.data;
  },

  // Change user password
  changePassword: async (data: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
    const response = await apiClient.post<UpdatePasswordResponse>('/users/change-password', data);
    return response.data;
  },
};
