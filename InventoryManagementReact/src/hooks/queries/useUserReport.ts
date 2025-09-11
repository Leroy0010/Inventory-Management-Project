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
    department: (departmentId: number, year?: number) => [...userReportKeys.all, 'department', departmentId, year] as const,
};

// User Report queries and mutations
export const useUserReportQueries = () => {
    const queryClient = useQueryClient();

    // Get user report for specific user (current Spring Boot implementation)
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

    // Get department user report (would need new Spring Boot endpoint)
    const getDepartmentUserReportQuery = (departmentId: number, year?: number) =>
        useQuery({
            queryKey: userReportKeys.department(departmentId, year),
            queryFn: () => userReportApi.getDepartmentUserReport(departmentId, year),
            enabled: !!departmentId,
            staleTime: 2 * 60 * 1000, // 2 minutes
        });

    // Get all users report with filters (would need new Spring Boot endpoint)
    const getAllUsersReportQuery = (filters: UserReportFilters = {}) =>
        useQuery({
            queryKey: userReportKeys.list(filters),
            queryFn: () => userReportApi.getAllUsersReport({
                year: filters.year,
                search: filters.search,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            }),
            staleTime: 2 * 60 * 1000, // 2 minutes
        });

    return {
        // Mutations
        getUserReportMutation,
        
        // Queries
        getDepartmentUserReportQuery,
        getAllUsersReportQuery,
    };
};
