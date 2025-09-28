import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '@/api/department';
import { departmentKeys } from './departmentKeys';
import { formErrorHandler } from '@/lib/formErrorHandler';

export function useCreateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: departmentApi.createDepartment,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });

            // Show success toast
            formErrorHandler.success({
                operation: 'create',
                entity: 'department',
                entityName: data.name,
            });
        },
        onError: (error: Error, variables) => {
            // Show error toast with context
            formErrorHandler.createDepartment(error, variables.name);
        },
    });
}
