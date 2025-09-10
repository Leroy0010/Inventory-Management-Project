import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventoryItem';
import { toast } from 'sonner';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';

// Query keys for departments
export const departmentKeys = {
    all: ['departments'] as const,
    lists: () => [...departmentKeys.all, 'list'] as const,
    list: (filters: string) => [...departmentKeys.lists(), { filters }] as const,
    details: () => [...departmentKeys.all, 'detail'] as const,
    detail: (id: number) => [...departmentKeys.details(), id] as const,
};

// Departments queries and mutations
export const useDepartmentQueries = () => {
    const queryClient = useQueryClient();

    // Get departments
    const departmentsQuery = useQuery({
        queryKey: departmentKeys.lists(),
        queryFn: inventoryApi.getDepartments,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Create department mutation
    const createDepartmentMutation = useMutation({
        mutationFn: inventoryApi.createDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            toast.success('Department created successfully!');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to create department: ${friendlyMessage}`);
        },
    });

    // Update department mutation
    const updateDepartmentMutation = useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) =>
            inventoryApi.updateDepartment(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            toast.success('Department updated successfully!');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to update department: ${friendlyMessage}`);
        },
    });

    // Delete department mutation
    const deleteDepartmentMutation = useMutation({
        mutationFn: inventoryApi.deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            toast.success('Department deleted successfully!');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to delete department: ${friendlyMessage}`);
        },
    });

    return {
        // Queries
        departmentsQuery,
        
        // Mutations
        createDepartmentMutation,
        updateDepartmentMutation,
        deleteDepartmentMutation,
    };
};
