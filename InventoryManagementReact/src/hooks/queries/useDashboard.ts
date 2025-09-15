import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import type { AdminDashboard, StorekeeperDashboard, StaffDashboard } from '@/types/dashboard';

// Admin dashboard hook
export const useAdminDashboard = () => {
  return useQuery<AdminDashboard>({
    queryKey: ['dashboard', 'admin'],
    queryFn: dashboardApi.getAdminDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Storekeeper dashboard hook
export const useStorekeeperDashboard = () => {
  return useQuery<StorekeeperDashboard>({
    queryKey: ['dashboard', 'storekeeper'],
    queryFn: dashboardApi.getStorekeeperDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Staff dashboard hook
export const useStaffDashboard = () => {
  return useQuery<StaffDashboard>({
    queryKey: ['dashboard', 'staff'],
    queryFn: dashboardApi.getStaffDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
