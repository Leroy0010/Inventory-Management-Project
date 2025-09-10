import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';

// Query keys for inventory balance
export const inventoryBalanceKeys = {
    all: ['inventory-balance'] as const,
    lists: () => [...inventoryBalanceKeys.all, 'list'] as const,
    list: (filters: string) => [...inventoryBalanceKeys.lists(), { filters }] as const,
};

// Inventory balance queries
export const useInventoryBalanceQueries = () => {
    // Get inventory balance
    const balanceQuery = useQuery({
        queryKey: inventoryBalanceKeys.lists(),
        queryFn: inventoryApi.getInventoryBalance,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    return {
        // Queries
        balanceQuery,
    };
};
