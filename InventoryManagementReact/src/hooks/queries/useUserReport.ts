import { useMutation, useQuery } from '@tanstack/react-query';
import { userReportApi } from '@/api/userReport';
import { toast } from 'sonner';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';
import type { UserReportFilters } from '@/types/userReport';

// Query keys for user report operations
export const userReportKeys = {
    all: ['user-reports'] as const,
    lists: () => [...userReportKeys.all, 'list'] as const,
    list: (filters: UserReportFilters) =>
        [...userReportKeys.lists(), { filters }] as const,
};

// User Report queries and mutations
export const useUserReportQueries = () => {
    // Get user report for specific user (existing Spring Boot implementation)
    const getUserReportMutation = useMutation({
        mutationFn: userReportApi.getUserReport,
        onSuccess: (data) => {
            toast.success('User report generated successfully!');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(
                    `Failed to generate user report: ${friendlyMessage}`,
                    {
                        description: validationErrors.join(', '),
                    }
                );
            } else {
                toast.error(
                    `Failed to generate user report: ${friendlyMessage}`
                );
            }
        },
    });

    // Get single user report with filters (updated Spring Boot implementation)
    const getUserReportQuery = (filters: UserReportFilters | null) =>
        useQuery({
            queryKey: userReportKeys.list(filters || {}),
            queryFn: () => userReportApi.getUserReport(filters!),
            enabled:
                !!filters &&
                !!filters.userId &&
                (!!filters.year || (!!filters.startDate && !!filters.endDate)),
            staleTime: 2 * 60 * 1000, // 2 minutes
        });

    return {
        // Mutations
        getUserReportMutation,

        // Queries
        getUserReportQuery,
    };
};
