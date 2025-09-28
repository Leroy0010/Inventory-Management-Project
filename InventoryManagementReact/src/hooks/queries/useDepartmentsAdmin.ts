import { useQuery } from '@tanstack/react-query';
import { departmentApi } from '@/api/department';
import { departmentKeys } from './departmentKeys';

export function useDepartmentsAdmin() {
    return useQuery({
        queryKey: [...departmentKeys.lists(), 'admin'],
        queryFn: departmentApi.fetchDepartmentsAdmin,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
