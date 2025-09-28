import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';
import { inventoryItemKeys } from './inventoryItemKeys';
import { formErrorHandler } from '@/lib/formErrorHandler';

export function useDeleteInventoryItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: inventoryApi.deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: inventoryItemKeys.lists(),
            });
            queryClient.invalidateQueries({ queryKey: ['inventory-balance'] });

            // Show success toast
            formErrorHandler.success({
                operation: 'delete',
                entity: 'inventory',
            });
        },
        onError: (error: unknown) => {
            // Show error toast
            formErrorHandler.deleteInventory(error);
        },
    });
}
