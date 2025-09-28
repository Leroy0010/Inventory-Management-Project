import { useMutation, useQueryClient } from '@tanstack/react-query';
import { batchApi } from '@/api/batch';
import { batchKeys } from './batchKeys';
import { toast } from 'sonner';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

export function useCreateBatch() {
    const queryClient = useQueryClient();

    return useMutation({
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
}
