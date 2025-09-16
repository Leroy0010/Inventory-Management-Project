import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  generateUserActivityReport,
  getUserActivitySummary,
  getOfficeUserActivityReport,
  getDepartmentUserActivityReport
} from '@/api/userActivityReport';
import type { 
  UserActivityReportRequest, 
  UserActivityReportResponseDto 
} from '@/types/userActivityReport';

// Query keys
export const userActivityReportKeys = {
  all: ['userActivityReport'] as const,
  summary: (year?: number) => [...userActivityReportKeys.all, 'summary', year] as const,
  department: (filters: Partial<UserActivityReportRequest>) => 
    [...userActivityReportKeys.all, 'department', filters] as const,
  office: (officeId: number, filters: Partial<UserActivityReportRequest>) => 
    [...userActivityReportKeys.all, 'office', officeId, filters] as const,
};

/**
 * Hook to get user activity summary for dashboard
 * @param year - Year to filter by (optional)
 * @returns Query result with summary data
 */
export function useUserActivitySummary(year?: number) {
  return useQuery({
    queryKey: userActivityReportKeys.summary(year),
    queryFn: () => getUserActivitySummary(year),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get department user activity report
 * @param filters - Report filters
 * @param enabled - Whether the query should be enabled
 * @returns Query result with department report data
 */
export function useDepartmentUserActivityReport(
  filters: Partial<UserActivityReportRequest> = {},
  enabled: boolean = true
) {
  return useQuery({
    queryKey: userActivityReportKeys.department(filters),
    queryFn: () => getDepartmentUserActivityReport(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get office user activity report
 * @param officeId - Office ID
 * @param filters - Report filters
 * @param enabled - Whether the query should be enabled
 * @returns Query result with office report data
 */
export function useOfficeUserActivityReport(
  officeId: number,
  filters: Partial<UserActivityReportRequest> = {},
  enabled: boolean = true
) {
  return useQuery({
    queryKey: userActivityReportKeys.office(officeId, filters),
    queryFn: () => getOfficeUserActivityReport(officeId, filters),
    enabled: enabled && officeId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to generate user activity report (mutation)
 * @returns Mutation for generating reports
 */
export function useGenerateUserActivityReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UserActivityReportRequest) => 
      generateUserActivityReport(request),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: userActivityReportKeys.all 
      });
      
      // Update specific query cache if we have the data
      if (variables.officeId) {
        queryClient.setQueryData(
          userActivityReportKeys.office(variables.officeId, variables),
          data
        );
      } else {
        queryClient.setQueryData(
          userActivityReportKeys.department(variables),
          data
        );
      }
    },
    onError: (error) => {
      // Failed to generate user activity report
    },
  });
}

/**
 * Hook to refresh user activity data
 * @returns Function to refresh all user activity queries
 */
export function useRefreshUserActivityData() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ 
      queryKey: userActivityReportKeys.all 
    });
  };
}

/**
 * Hook to prefetch user activity data
 * @returns Function to prefetch data
 */
export function usePrefetchUserActivityData() {
  const queryClient = useQueryClient();

  return {
    prefetchSummary: (year?: number) => {
      queryClient.prefetchQuery({
        queryKey: userActivityReportKeys.summary(year),
        queryFn: () => getUserActivitySummary(year),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchDepartment: (filters: Partial<UserActivityReportRequest>) => {
      queryClient.prefetchQuery({
        queryKey: userActivityReportKeys.department(filters),
        queryFn: () => getDepartmentUserActivityReport(filters),
        staleTime: 2 * 60 * 1000,
      });
    },
    prefetchOffice: (officeId: number, filters: Partial<UserActivityReportRequest>) => {
      queryClient.prefetchQuery({
        queryKey: userActivityReportKeys.office(officeId, filters),
        queryFn: () => getOfficeUserActivityReport(officeId, filters),
        staleTime: 2 * 60 * 1000,
      });
    },
  };
}

/**
 * Hook to get cached user activity data
 * @param queryKey - Query key to get data for
 * @returns Cached data or undefined
 */
export function useUserActivityData(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<UserActivityReportResponseDto>(queryKey);
}

/**
 * Hook to set user activity data in cache
 * @returns Function to set data in cache
 */
export function useSetUserActivityData() {
  const queryClient = useQueryClient();

  return (queryKey: readonly unknown[], data: UserActivityReportResponseDto) => {
    queryClient.setQueryData(queryKey, data);
  };
}
