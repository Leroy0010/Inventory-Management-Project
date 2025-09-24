import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/user';
import { formErrorHandler } from '@/lib/formErrorHandler';

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

    // Get user emails and IDs
    const userEmailsAndIdsQuery = useQuery({
        queryKey: [...userKeys.all, 'emails-and-ids'],
        queryFn: userApi.getEmailsAndIds,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Create staff mutation
    const createStaffMutation = useMutation({
        mutationFn: userApi.createStaff,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });

            // Show success toast
            formErrorHandler.success({
                operation: 'create',
                entity: 'staff',
                entityName: data.fullName,
            });
        },
        onError: (error: unknown, variables) => {
            // Show error toast with context
            formErrorHandler.createStaff(
                error,
                `${variables.firstName} ${variables.lastName}`
            );
        },
    });

    // Create storekeeper mutation
    const createStorekeeperMutation = useMutation({
        mutationFn: userApi.createStorekeeper,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });

            // Show success toast
            formErrorHandler.success({
                operation: 'create',
                entity: 'storekeeper',
                entityName: data.fullName,
            });
        },
        onError: (error: unknown, variables) => {
            // Show error toast with context
            formErrorHandler.createStorekeeper(
                error,
                `${variables.firstName} ${variables.lastName}`
            );
        },
    });

    return {
        // Queries
        usersQuery,
        userEmailsAndIdsQuery,

        // Mutations
        createStaffMutation,
        createStorekeeperMutation,
    };
};

// Separate hook for user emails and IDs only (used in filters)
export const useUserEmailsAndIds = () => {
    const userEmailsAndIdsQuery = useQuery({
        queryKey: [...userKeys.all, 'emails-and-ids'],
        queryFn: userApi.getEmailsAndIds,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return { userEmailsAndIdsQuery };
};
