import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';
import { inventoryItemKeys } from './inventoryItemKeys';

export function useInventoryItem(id: number) {
    return useQuery({
        queryKey: inventoryItemKeys.detail(id),
        queryFn: () => inventoryApi.getItemById(id),
        enabled: !!id,
    });
}
