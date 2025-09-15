import apiClient from './client';
import type { AdminDashboard, StorekeeperDashboard, StaffDashboard } from '@/types/dashboard';

export const dashboardApi = {
  // Get admin dashboard data
  getAdminDashboard: async (): Promise<AdminDashboard> => {
    const response = await apiClient.get('/api/dashboard/admin');
    return response.data;
  },

  // Get storekeeper dashboard data
  getStorekeeperDashboard: async (): Promise<StorekeeperDashboard> => {
    const response = await apiClient.get('/api/dashboard/storekeeper');
    return response.data;
  },

  // Get staff dashboard data
  getStaffDashboard: async (): Promise<StaffDashboard> => {
    const response = await apiClient.get('/api/dashboard/staff');
    return response.data;
  },
};
