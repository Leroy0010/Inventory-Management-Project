import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/user';
import { toast } from 'sonner';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

// Query keys for user operations
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: string) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
};

// User queries and mutations
export const useUserQueries = () => {
    const queryClient = useQueryClient();

    // Get all users
    const usersQuery = useQuery({
        queryKey: userKeys.lists(),
        queryFn: userApi.getUsers,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Create staff mutation
    const createStaffMutation = useMutation({
        mutationFn: userApi.createStaff,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success(
                `Staff member "${data.fullName}" created successfully!`
            );
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(
                    `Failed to create staff member: ${friendlyMessage}`,
                    {
                        description: validationErrors.join(', '),
                    }
                );
            } else {
                toast.error(
                    `Failed to create staff member: ${friendlyMessage}`
                );
            }
        },
    });

    // Create storekeeper mutation
    const createStorekeeperMutation = useMutation({
        mutationFn: userApi.createStorekeeper,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success(
                `Storekeeper "${data.fullName}" created successfully!`
            );
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(
                    `Failed to create storekeeper: ${friendlyMessage}`,
                    {
                        description: validationErrors.join(', '),
                    }
                );
            } else {
                toast.error(`Failed to create storekeeper: ${friendlyMessage}`);
            }
        },
    });

    return {
        // Queries
        usersQuery,

        // Mutations
        createStaffMutation,
        createStorekeeperMutation,
    };
};
