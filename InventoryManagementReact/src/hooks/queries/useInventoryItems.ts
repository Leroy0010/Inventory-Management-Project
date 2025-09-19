import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';
import { toast } from 'sonner';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';
import type { CreateInventoryItemDto } from '@/types/inventoryItem';

// Query keys for inventory items
export const inventoryItemKeys = {
    all: ['inventory-items'] as const,
    lists: () => [...inventoryItemKeys.all, 'list'] as const,
    list: (filters: string) =>
        [...inventoryItemKeys.lists(), { filters }] as const,
    details: () => [...inventoryItemKeys.all, 'detail'] as const,
    detail: (id: number) => [...inventoryItemKeys.details(), id] as const,
};

// Inventory items queries and mutations
export const useInventoryItemQueries = () => {
    const queryClient = useQueryClient();

    // Get all inventory items
    const itemsQuery = useQuery({
        queryKey: inventoryItemKeys.lists(),
        queryFn: inventoryApi.getItems,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Get inventory item by ID - this should be a custom hook
    const useItemQuery = (id: number) =>
        useQuery({
            queryKey: inventoryItemKeys.detail(id),
            queryFn: () => inventoryApi.getItemById(id),
            enabled: !!id,
        });

    // Create inventory item mutation
    const createItemMutation = useMutation({
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
            toast.success(
                `Inventory item "${data.name}" created successfully!`
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
                    `Failed to create inventory item: ${friendlyMessage}`,
                    {
                        description: validationErrors.join(', '),
                    }
                );
            } else {
                toast.error(
                    `Failed to create inventory item: ${friendlyMessage}`
                );
            }
        },
    });

    // Update inventory item mutation
    const updateItemMutation = useMutation({
        mutationFn: inventoryApi.updateItem,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: inventoryItemKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: inventoryItemKeys.detail(data.id),
            });
            queryClient.invalidateQueries({ queryKey: ['inventory-balance'] });
            toast.success(
                `Inventory item "${data.name}" updated successfully!`
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
                    `Failed to update inventory item: ${friendlyMessage}`,
                    {
                        description: validationErrors.join(', '),
                    }
                );
            } else {
                toast.error(
                    `Failed to update inventory item: ${friendlyMessage}`
                );
            }
        },
    });

    // Delete inventory item mutation
    const deleteItemMutation = useMutation({
        mutationFn: inventoryApi.deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: inventoryItemKeys.lists(),
            });
            queryClient.invalidateQueries({ queryKey: ['inventory-balance'] });
            toast.success('Inventory item deleted successfully!');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(
                    `Failed to delete inventory item: ${friendlyMessage}`,
                    {
                        description: validationErrors.join(', '),
                    }
                );
            } else {
                toast.error(
                    `Failed to delete inventory item: ${friendlyMessage}`
                );
            }
        },
    });

    return {
        // Queries
        itemsQuery,
        useItemQuery,

        // Mutations
        createItemMutation,
        updateItemMutation,
        deleteItemMutation,
    };
};
