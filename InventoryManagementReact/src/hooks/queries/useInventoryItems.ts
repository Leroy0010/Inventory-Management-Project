import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';
import { formErrorHandler } from '@/lib/formErrorHandler';
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

    // Delete inventory item mutation
    const deleteItemMutation = useMutation({
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
