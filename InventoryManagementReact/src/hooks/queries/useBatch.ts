import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { batchApi } from '@/api/batch';
import { toast } from 'sonner';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

// Query keys for batch operations
export const batchKeys = {
    all: ['batches'] as const,
    lists: () => [...batchKeys.all, 'list'] as const,
    list: (filters: string) => [...batchKeys.lists(), { filters }] as const,
    details: () => [...batchKeys.all, 'detail'] as const,
    detail: (id: number) => [...batchKeys.details(), id] as const,
};

// Batch queries and mutations
export const useBatchQueries = () => {
    const queryClient = useQueryClient();

    // Get all batches
    const batchesQuery = useQuery({
        queryKey: batchKeys.lists(),
        queryFn: batchApi.getBatches,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Create batch mutation
    const createBatchMutation = useMutation({
        mutationFn: batchApi.createBatch,
        onSuccess: (data) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            toast.success(`Batch created successfully! Batch ID: ${data.id}`);
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to create batch: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to create batch: ${friendlyMessage}`);
            }
        },
    });

    return {
        // Queries
        batchesQuery,

        // Mutations
        createBatchMutation,
    };
};
