import { api, handleApiError } from './client';
import type { 
  Staff, 
  CreateStaffRequest, 
  UpdateStaffRequest, 
  ToggleStaffStatusRequest,
  StaffFilters,
  StaffListResponse 
} from '@/types/staff';

export const staffApi = {
  // Get all staff members for the current user's department
  getStaff: async (filters?: StaffFilters): Promise<Staff[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.active !== undefined) params.append('active', filters.active.toString());
      if (filters?.officeName) params.append('officeName', filters.officeName);
      
      const queryString = params.toString();
      const url = queryString ? `/api/storekeeper/get-users?${queryString}` : '/api/storekeeper/get-users';
      
      return await api.get<Staff[]>(url);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get staff by ID
  getStaffById: async (id: number): Promise<Staff> => {
    try {
      return await api.get<Staff>(`/api/staff/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new staff member
  createStaff: async (staff: CreateStaffRequest): Promise<Staff> => {
    try {
      return await api.post<Staff>('/api/storekeeper/register-staff', staff);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update staff member
  updateStaff: async (id: number, staff: UpdateStaffRequest): Promise<Staff> => {
    try {
      return await api.put<Staff>(`/api/staff/${id}`, staff);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Toggle staff active status
  toggleStaffStatus: async (request: ToggleStaffStatusRequest): Promise<Staff> => {
    try {
      return await api.put<Staff>('/api/user/update-status', request);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete staff member (soft delete by setting active to false)
  deleteStaff: async (id: number): Promise<void> => {
    try {
      await staffApi.toggleStaffStatus({ id, active: false });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get staff emails and IDs for notifications
  getStaffEmailsAndIds: async (): Promise<Array<{ id: number; email: string }>> => {
    try {
      return await api.get<Array<{ id: number; email: string }>>('/api/users/get-all-emails-and-ids');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
