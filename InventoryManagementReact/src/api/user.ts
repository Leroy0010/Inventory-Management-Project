import { api, handleApiError } from './client';
import type { CreateStaffDto, CreateStorekeeperDto, UserResponseDto } from '@/types/user';

// User API functions based on Spring Boot UserController
export const userApi = {
    // Get all users
    getUsers: async (): Promise<UserResponseDto[]> => {
        try {
            return await api.get<UserResponseDto[]>('/users/admin/get');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Create new staff member
    createStaff: async (staff: CreateStaffDto): Promise<UserResponseDto> => {
        try {
            return await api.post<UserResponseDto>('/users/storekeeper/register-staff', staff);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Create new storekeeper
    createStorekeeper: async (storekeeper: CreateStorekeeperDto): Promise<UserResponseDto> => {
        try {
            return await api.post<UserResponseDto>('/users/admin/register-user', storekeeper);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
