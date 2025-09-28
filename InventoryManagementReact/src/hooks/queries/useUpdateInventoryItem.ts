import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';
import { inventoryItemKeys } from './inventoryItemKeys';
import { formErrorHandler } from '@/lib/formErrorHandler';

export function useUpdateInventoryItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: inventoryApi.updateItem,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: inventoryItemKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: inventoryItemKeys.detail(data.id),
            });
            queryClient.invalidateQueries({ queryKey: ['inventory-balance'] });

            // Show success toast
            formErrorHandler.success({
                operation: 'update',
                entity: 'inventory',
                entityName: data.name,
                entityId: data.id,
            });
        },
        onError: (error: unknown, variables) => {
            // Show error toast with context
            formErrorHandler.updateInventory(
                error,
                variables.name,
                variables.id
            );
        },
    });
}
