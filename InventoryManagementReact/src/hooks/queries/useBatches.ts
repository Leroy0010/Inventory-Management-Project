import { useQuery } from '@tanstack/react-query';
import { batchApi } from '@/api/batch';
import { batchKeys } from './batchKeys';

export function useBatches() {
    return useQuery({
        queryKey: batchKeys.lists(),
        queryFn: batchApi.getBatches,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
