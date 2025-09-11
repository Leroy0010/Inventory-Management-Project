import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userReportApi } from '@/api/userReport';
import { toast } from 'sonner';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';
import type { UserReportRequest, UserReportFilters } from '@/types/userReport';

// Query keys for user report operations
export const userReportKeys = {
    all: ['user-reports'] as const,
    lists: () => [...userReportKeys.all, 'list'] as const,
    list: (filters: UserReportFilters) => [...userReportKeys.lists(), { filters }] as const,
    user: (userId: number, year?: number) => [...userReportKeys.all, 'user', userId, year] as const,
    department: (departmentId: number, filters: UserReportFilters) => [...userReportKeys.all, 'department', departmentId, filters] as const,
};

// User Report queries and mutations
export const useUserReportQueries = () => {
    const queryClient = useQueryClient();

    // Get user report for specific user (existing Spring Boot implementation)
    const getUserReportMutation = useMutation({
        mutationFn: userReportApi.getUserReport,
        onSuccess: (data) => {
            toast.success('User report generated successfully!');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to generate user report: ${friendlyMessage}`);
        },
    });

    // Get all users report with filters (new Spring Boot endpoint)
    const getAllUsersReportQuery = (filters: UserReportFilters = {}) =>
        useQuery({
            queryKey: userReportKeys.list(filters),
            queryFn: () => userReportApi.getAllUsersReport(filters),
            staleTime: 2 * 60 * 1000, // 2 minutes
        });

    // Get department user report with filters (new Spring Boot endpoint)
    const getDepartmentUserReportQuery = (departmentId: number, filters: UserReportFilters = {}) =>
        useQuery({
            queryKey: userReportKeys.department(departmentId, filters),
            queryFn: () => userReportApi.getDepartmentUserReport(departmentId, filters),
            enabled: !!departmentId,
            staleTime: 2 * 60 * 1000, // 2 minutes
        });

    return {
        // Mutations
        getUserReportMutation,
        
        // Queries
        getAllUsersReportQuery,
        getDepartmentUserReportQuery,
    };
};
