import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';
import { inventoryItemKeys } from './inventoryItemKeys';
import { formErrorHandler } from '@/lib/formErrorHandler';
import type { CreateInventoryItemDto } from '@/types/inventoryItem';

export function useCreateInventoryItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            item,
            imageFile,
        }: {
            item: CreateInventoryItemDto;
            imageFile?: File;
        }) => inventoryApi.createItem(item, imageFile),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: inventoryItemKeys.lists(),
            });
            queryClient.invalidateQueries({ queryKey: ['inventory-balance'] });

            // Show success toast
            formErrorHandler.success({
                operation: 'create',
                entity: 'inventory',
                entityName: data.name,
            });
        },
        onError: (error: unknown, variables) => {
            // Show error toast with context
            formErrorHandler.createInventory(error, variables.item.name);
        },
    });
}
