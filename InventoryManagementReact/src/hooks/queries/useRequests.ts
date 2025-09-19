import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestApi } from '@/api/requests';
import { toast } from 'sonner';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from '@/lib/error-utils';

// Query keys
export const requestKeys = {
    all: ['requests'] as const,
    lists: () => [...requestKeys.all, 'list'] as const,
    list: (filters: string) => [...requestKeys.lists(), { filters }] as const,
    details: () => [...requestKeys.all, 'detail'] as const,
    detail: (id: number) => [...requestKeys.details(), id] as const,
};

// Request queries
export const useRequestQueries = () => {
    const queryClient = useQueryClient();

    // Get user's requests
    const userRequestsQuery = useQuery({
        queryKey: requestKeys.lists(),
        queryFn: requestApi.getUserRequests,
        staleTime: 30000, // 30 seconds
        refetchOnWindowFocus: false,
    });

    // Get request by ID
    const getRequestByIdQuery = (id: number) =>
        useQuery({
            queryKey: requestKeys.detail(id),
            queryFn: () => requestApi.getRequestById(id),
            enabled: !!id,
            staleTime: 30000,
        });

    // Submit cart as request mutation
    const submitCartAsRequestMutation = useMutation({
        mutationFn: requestApi.submitCartAsRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success(
                `Request submitted successfully! Request ID: ${data.id}`
            );
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to submit request: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to submit request: ${friendlyMessage}`);
            }
        },
    });

    // Create request mutation
    const createRequestMutation = useMutation({
        mutationFn: requestApi.createRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
            toast.success(
                `Request created successfully! Request ID: ${data.id}`
            );
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to create request: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to create request: ${friendlyMessage}`);
            }
        },
    });

    // Approve or reject request mutation
    const approveOrRejectRequestMutation = useMutation({
        mutationFn: requestApi.approveOrRejectRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: requestKeys.detail(data.id),
            });
            const action = data.status === 'APPROVED' ? 'approved' : 'rejected';
            toast.success(`Request ${action} successfully!`);
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to process request: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to process request: ${friendlyMessage}`);
            }
        },
    });

    // Fulfill request mutation
    const fulfillRequestMutation = useMutation({
        mutationFn: requestApi.fulfillRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: requestKeys.detail(data.id),
            });
            toast.success('Request fulfilled successfully!');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            const validationErrors = formatValidationErrors(
                apiError.details || null
            );

            if (validationErrors.length > 0) {
                toast.error(`Failed to fulfill request: ${friendlyMessage}`, {
                    description: validationErrors.join(', '),
                });
            } else {
                toast.error(`Failed to fulfill request: ${friendlyMessage}`);
            }
        },
    });

    return {
        // Queries
        userRequestsQuery,
        getRequestByIdQuery,

        // Mutations
        submitCartAsRequestMutation,
        createRequestMutation,
        approveOrRejectRequestMutation,
        fulfillRequestMutation,
    };
};
