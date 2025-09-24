import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { officeApi } from '@/api/office';
import type {
    Office,
    CreateOfficeRequest,
    UpdateOfficeRequest,
    OfficeFilters,
} from '@/types/office';
import { formErrorHandler } from '@/lib/formErrorHandler';

// Query keys
export const officeKeys = {
    all: ['office'] as const,
    lists: () => [...officeKeys.all, 'list'] as const,
    list: (filters?: OfficeFilters) =>
        [...officeKeys.lists(), filters] as const,
    details: () => [...officeKeys.all, 'detail'] as const,
    detail: (id: number) => [...officeKeys.details(), id] as const,
    names: () => [...officeKeys.all, 'names'] as const,
};

// Get all offices
export const useOffices = (filters?: OfficeFilters) => {
    return useQuery({
        queryKey: officeKeys.list(filters),
        queryFn: () => officeApi.getOffices(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get office by ID
export const useOfficeById = (id: number) => {
    return useQuery({
        queryKey: officeKeys.detail(id),
        queryFn: () => officeApi.getOfficeById(id),
        enabled: !!id,
    });
};

// Get office names
export const useOfficeNames = () => {
    return useQuery({
        queryKey: officeKeys.names(),
        queryFn: () => officeApi.getOfficeNames(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Create office
export const useCreateOffice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (office: CreateOfficeRequest) =>
            officeApi.createOffice(office),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: officeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: officeKeys.names() });

            // Show success toast
            formErrorHandler.success({
                operation: 'create',
                entity: 'office',
                entityName: variables.name,
            });
        },
        onError: (error: Error, variables) => {
            // Show error toast with context
            formErrorHandler.createOffice(error, variables.name);
        },
    });
};

// Update office
export const useUpdateOffice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateOfficeRequest }) =>
            officeApi.updateOffice(id, data),
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: officeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: officeKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: officeKeys.names() });

            // Show success toast
            formErrorHandler.success({
                operation: 'update',
                entity: 'office',
                entityName: data.name,
                entityId: data.id,
            });
        },
        onError: (error: Error, variables) => {
            // Show error toast with context
            formErrorHandler.createOffice(error, variables.data.name);
        },
    });
};

// Delete office
export const useDeleteOffice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => officeApi.deleteOffice(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: officeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: officeKeys.names() });

            // Show success toast
            formErrorHandler.success({
                operation: 'delete',
                entity: 'office',
            });
        },
        onError: (error: Error) => {
            // Show error toast
            formErrorHandler.createOffice(error);
        },
    });
};
