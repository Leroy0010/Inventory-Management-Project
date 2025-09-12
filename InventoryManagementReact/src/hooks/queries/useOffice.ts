import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { officeApi } from '@/api/office';
import { toast } from 'sonner';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';

// Query keys for office operations
export const officeKeys = {
    all: ['offices'] as const,
    lists: () => [...officeKeys.all, 'list'] as const,
    list: (filters: string) => [...officeKeys.lists(), { filters }] as const,
    names: () => [...officeKeys.all, 'names'] as const,
    details: () => [...officeKeys.all, 'detail'] as const,
    detail: (id: number) => [...officeKeys.details(), id] as const,
};

// Office queries and mutations
export const useOfficeQueries = () => {
    const queryClient = useQueryClient();

    // Get all offices
    const officesQuery = useQuery({
        queryKey: officeKeys.lists(),
        queryFn: officeApi.getOffices,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Get office names only
    const officeNamesQuery = useQuery({
        queryKey: officeKeys.names(),
        queryFn: officeApi.getOfficeNames,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Create office mutation
    const createOfficeMutation = useMutation({
        mutationFn: officeApi.createOffice,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: officeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: officeKeys.names() });
            toast.success(`Office "${data.name}" created successfully!`);
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to create office: ${friendlyMessage}`);
        },
    });

    return {
        // Queries
        officesQuery,
        officeNamesQuery,
        
        // Mutations
        createOfficeMutation,
    };
};
