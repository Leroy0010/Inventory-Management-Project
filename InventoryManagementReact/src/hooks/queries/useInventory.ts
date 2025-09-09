import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi, type CreateInventoryItemDto, type UpdateInventoryItemDto, type CreateBatchDto } from '@/api/inventory';

// Query Keys
export const inventoryKeys = {
    all: ['inventory'] as const,
    items: () => [...inventoryKeys.all, 'items'] as const,
    item: (id: number) => [...inventoryKeys.items(), id] as const,
    departments: () => [...inventoryKeys.all, 'departments'] as const,
    batches: () => [...inventoryKeys.all, 'batches'] as const,
    balance: () => [...inventoryKeys.all, 'balance'] as const,
    transactions: () => [...inventoryKeys.all, 'transactions'] as const,
};

// Custom hook for inventory queries and mutations
export function useInventoryQueries() {
    const queryClient = useQueryClient();

    // Get all inventory items
    const itemsQuery = useQuery({
        queryKey: inventoryKeys.items(),
        queryFn: inventoryApi.getItems,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Get inventory item by ID
    const useItemQuery = (id: number) => useQuery({
        queryKey: inventoryKeys.item(id),
        queryFn: () => inventoryApi.getItemById(id),
        enabled: !!id,
    });

    // Get departments
    const departmentsQuery = useQuery({
        queryKey: inventoryKeys.departments(),
        queryFn: inventoryApi.getDepartments,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Get batches
    const batchesQuery = useQuery({
        queryKey: inventoryKeys.batches(),
        queryFn: inventoryApi.getBatches,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Get inventory balance
    const balanceQuery = useQuery({
        queryKey: inventoryKeys.balance(),
        queryFn: inventoryApi.getInventoryBalance,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    // Get stock transactions
    const transactionsQuery = useQuery({
        queryKey: inventoryKeys.transactions(),
        queryFn: inventoryApi.getStockTransactions,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    // Create inventory item mutation
    const createItemMutation = useMutation({
        mutationFn: inventoryApi.createItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.balance() });
        },
    });

    // Update inventory item mutation
    const updateItemMutation = useMutation({
        mutationFn: inventoryApi.updateItem,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.item(data.id) });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.balance() });
        },
    });

    // Delete inventory item mutation
    const deleteItemMutation = useMutation({
        mutationFn: inventoryApi.deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.balance() });
        },
    });

    // Create department mutation
    const createDepartmentMutation = useMutation({
        mutationFn: inventoryApi.createDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.departments() });
        },
    });

    // Update department mutation
    const updateDepartmentMutation = useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) => inventoryApi.updateDepartment(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.departments() });
        },
    });

    // Delete department mutation
    const deleteDepartmentMutation = useMutation({
        mutationFn: inventoryApi.deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.departments() });
        },
    });

    // Create batch mutation
    const createBatchMutation = useMutation({
        mutationFn: inventoryApi.createBatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.batches() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.balance() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.transactions() });
        },
    });

    return {
        // Queries
        itemsQuery,
        useItemQuery,
        departmentsQuery,
        batchesQuery,
        balanceQuery,
        transactionsQuery,
        
        // Mutations
        createItemMutation,
        updateItemMutation,
        deleteItemMutation,
        createDepartmentMutation,
        updateDepartmentMutation,
        deleteDepartmentMutation,
        createBatchMutation,
    };
}
