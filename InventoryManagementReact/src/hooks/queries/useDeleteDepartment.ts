import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '@/api/department';
import { departmentKeys } from './departmentKeys';
import { formErrorHandler } from '@/lib/formErrorHandler';

export function useDeleteDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: departmentApi.deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });

            // Show success toast
            formErrorHandler.success({
                operation: 'delete',
                entity: 'department',
            });
        },
        onError: (error: Error) => {
            // Show error toast
            formErrorHandler.createDepartment(error);
        },
    });
}
