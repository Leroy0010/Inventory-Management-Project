import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/api/staff';
import type { 
  Staff, 
  CreateStaffRequest, 
  UpdateStaffRequest, 
  ToggleStaffStatusRequest,
  StaffFilters 
} from '@/types/staff';
import { toast } from 'sonner';

// Query keys
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters?: StaffFilters) => [...staffKeys.lists(), filters] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: number) => [...staffKeys.details(), id] as const,
  emails: () => [...staffKeys.all, 'emails'] as const,
};

// Get all staff members
export const useStaff = (filters?: StaffFilters) => {
  return useQuery({
    queryKey: staffKeys.list(filters),
    queryFn: () => staffApi.getStaff(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get staff by ID
export const useStaffById = (id: number) => {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getStaffById(id),
    enabled: !!id,
  });
};

// Get staff emails and IDs
export const useStaffEmailsAndIds = () => {
  return useQuery({
    queryKey: staffKeys.emails(),
    queryFn: () => staffApi.getStaffEmailsAndIds(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create staff member
export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staff: CreateStaffRequest) => staffApi.createStaff(staff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      toast.success('Staff member created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create staff member');
    },
  });
};

// Update staff member
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStaffRequest }) => 
      staffApi.updateStaff(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
      toast.success('Staff member updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update staff member');
    },
  });
};

// Toggle staff status
export const useToggleStaffStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ToggleStaffStatusRequest) => staffApi.toggleStaffStatus(request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
      toast.success('Staff status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update staff status');
    },
  });
};

// Delete staff member
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => staffApi.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      toast.success('Staff member deactivated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deactivate staff member');
    },
  });
};
