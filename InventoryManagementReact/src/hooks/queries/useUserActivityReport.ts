import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateUserActivityReport } from '@/api/userActivityReport';
import { formErrorHandler } from '@/lib/formErrorHandler';
import type {
    UserActivityReportRequest,
    UserActivityReportResponseDto,
} from '@/types/userActivityReport';

// Query keys
export const userActivityReportKeys = {
    all: ['userActivityReport'] as const,
    summary: (year?: number) =>
        [...userActivityReportKeys.all, 'summary', year] as const,
    department: (filters: Partial<UserActivityReportRequest>) =>
        [...userActivityReportKeys.all, 'department', filters] as const,
    office: (officeId: number, filters: Partial<UserActivityReportRequest>) =>
        [...userActivityReportKeys.all, 'office', officeId, filters] as const,
};

/**
 * Hook to get user activity report
 * @param filters - Report filters
 * @param enabled - Whether the query should be enabled
 * @returns Query result with report data
 */
export function useUserActivityReport(
    filters: Partial<UserActivityReportRequest> = {},
    enabled: boolean = true
) {
    return useQuery({
        queryKey: userActivityReportKeys.department(filters),
        queryFn: () =>
            generateUserActivityReport(filters as UserActivityReportRequest),
        enabled,
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
                queryKey: userActivityReportKeys.all,
            });

            // Update specific query cache if we have the data
            if (variables.officeId) {
                queryClient.setQueryData(
                    userActivityReportKeys.office(
                        variables.officeId,
                        variables
                    ),
                    data
                );
            } else {
                queryClient.setQueryData(
                    userActivityReportKeys.department(variables),
                    data
                );
            }

            // Show success toast
            formErrorHandler.success({
                operation: 'create',
                entity: 'report',
                entityName: 'User Activity Report',
            });
        },
        onError: (error: unknown) => {
            // Show error toast
            formErrorHandler.createReport(error, 'User Activity Report');
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
            queryKey: userActivityReportKeys.all,
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
        prefetchReport: (filters: Partial<UserActivityReportRequest>) => {
            queryClient.prefetchQuery({
                queryKey: userActivityReportKeys.department(filters),
                queryFn: () =>
                    generateUserActivityReport(
                        filters as UserActivityReportRequest
                    ),
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

    return (
        queryKey: readonly unknown[],
        data: UserActivityReportResponseDto
    ) => {
        queryClient.setQueryData(queryKey, data);
    };
}
