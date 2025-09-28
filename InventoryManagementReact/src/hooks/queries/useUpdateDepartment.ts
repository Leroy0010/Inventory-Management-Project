import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '@/api/department';
import { departmentKeys } from './departmentKeys';
import { formErrorHandler } from '@/lib/formErrorHandler';

export function useUpdateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) =>
            departmentApi.updateDepartment(id, name),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });

            // Show success toast
            formErrorHandler.success({
                operation: 'update',
                entity: 'department',
                entityName: data.name,
                entityId: data.id,
            });
        },
        onError: (error: Error, variables) => {
            // Show error toast with context
            formErrorHandler.createDepartment(error, variables.name);
        },
    });
}
