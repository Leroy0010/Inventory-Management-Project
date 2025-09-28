import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';

export function useInventoryBalance() {
    return useQuery({
        queryKey: ['inventory-balance'],
        queryFn: inventoryApi.getInventoryBalance,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
