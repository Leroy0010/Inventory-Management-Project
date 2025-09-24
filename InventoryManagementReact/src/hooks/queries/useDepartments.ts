import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '@/api/department';
import { formErrorHandler } from '@/lib/formErrorHandler';

// Query keys for departments
export const departmentKeys = {
    all: ['departments'] as const,
    lists: () => [...departmentKeys.all, 'list'] as const,
    list: (filters: string) =>
        [...departmentKeys.lists(), { filters }] as const,
    details: () => [...departmentKeys.all, 'detail'] as const,
    detail: (id: number) => [...departmentKeys.details(), id] as const,
};

// Departments queries and mutations
export const useDepartmentQueries = () => {
    const queryClient = useQueryClient();

    // Get departments
    const departmentsQuery = useQuery({
        queryKey: departmentKeys.lists(),
        queryFn: departmentApi.getDepartments,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Get departments for admin
    const departmentsQueryAdmin = useQuery({
        queryKey: [...departmentKeys.lists(), 'admin'],
        queryFn: departmentApi.fetchDepartmentsAdmin,
        staleTime: 5 * 60 * 1000,
    });

    // Create department mutation
    const createDepartmentMutation = useMutation({
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

    // Update department mutation
    const updateDepartmentMutation = useMutation({
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

    // Delete department mutation
    const deleteDepartmentMutation = useMutation({
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

    return {
        // Queries
        departmentsQuery,
        departmentsQueryAdmin,

        // Mutations
        createDepartmentMutation,
        updateDepartmentMutation,
        deleteDepartmentMutation,
    };
};
