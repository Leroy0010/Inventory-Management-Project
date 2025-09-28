import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';
import { inventoryItemKeys } from './inventoryItemKeys';

export function useInventoryItems() {
    return useQuery({
        queryKey: inventoryItemKeys.lists(),
        queryFn: inventoryApi.getItems,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
