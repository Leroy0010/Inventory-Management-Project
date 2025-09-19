import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { officeApi } from '@/api/office';
import type {
    Office,
    CreateOfficeRequest,
    UpdateOfficeRequest,
    OfficeFilters,
} from '@/types/office';
import { toast } from 'sonner';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: officeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: officeKeys.names() });
            toast.success('Office created successfully');
        },
        onError: (error: Error) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to create office: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to create office: ${friendlyMessage}`);
            }
        },
    });
};

// Update office
export const useUpdateOffice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateOfficeRequest }) =>
            officeApi.updateOffice(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: officeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: officeKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: officeKeys.names() });
            toast.success('Office updated successfully');
        },
        onError: (error: Error) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to update office: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to update office: ${friendlyMessage}`);
            }
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
            toast.success('Office deleted successfully');
        },
        onError: (error: Error) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to delete office: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to delete office: ${friendlyMessage}`);
            }
        },
    });
};
