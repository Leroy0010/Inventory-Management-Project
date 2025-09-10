import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';

// Query keys for stock transactions
export const stockTransactionKeys = {
    all: ['stock-transactions'] as const,
    lists: () => [...stockTransactionKeys.all, 'list'] as const,
    list: (filters: string) => [...stockTransactionKeys.lists(), { filters }] as const,
};

// Stock transactions queries
export const useStockTransactionQueries = () => {
    // Get stock transactions
    const transactionsQuery = useQuery({
        queryKey: stockTransactionKeys.lists(),
        queryFn: inventoryApi.getStockTransactions,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    return {
        // Queries
        transactionsQuery,
    };
};
