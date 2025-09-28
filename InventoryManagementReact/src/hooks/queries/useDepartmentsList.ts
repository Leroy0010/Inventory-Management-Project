import { useQuery } from '@tanstack/react-query';
import { departmentApi } from '@/api/department';
import { departmentKeys } from './departmentKeys';

export function useDepartments() {
    return useQuery({
        queryKey: departmentKeys.lists(),
        queryFn: departmentApi.getDepartments,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
