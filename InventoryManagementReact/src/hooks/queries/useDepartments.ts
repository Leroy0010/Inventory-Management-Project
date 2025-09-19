import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '@/api/department';
import { toast } from 'sonner';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            toast.success('Department created successfully!');
        },
        onError: (error: Error) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to create department: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to create department: ${friendlyMessage}`);
            }
        },
    });

    // Update department mutation
    const updateDepartmentMutation = useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) =>
            departmentApi.updateDepartment(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            toast.success('Department updated successfully!');
        },
        onError: (error: Error) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to update department: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to update department: ${friendlyMessage}`);
            }
        },
    });

    // Delete department mutation
    const deleteDepartmentMutation = useMutation({
        mutationFn: departmentApi.deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            toast.success('Department deleted successfully!');
        },
        onError: (error: Error) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to delete department: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to delete department: ${friendlyMessage}`);
            }
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
