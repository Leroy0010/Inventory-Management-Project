import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestApi, type CreateRequestDto, type ApproveRequestDto, type RequestFulfillmentDto } from '@/api/requests';

// Query Keys
export const requestKeys = {
    all: ['requests'] as const,
    list: () => [...requestKeys.all, 'list'] as const,
    userRequests: () => [...requestKeys.all, 'user'] as const,
    request: (id: number) => [...requestKeys.all, 'detail', id] as const,
};

// Custom hook for request queries and mutations
export function useRequestQueries() {
    const queryClient = useQueryClient();

    // Get all requests (for storekeepers/admins)
    const requestsQuery = useQuery({
        queryKey: requestKeys.list(),
        queryFn: requestApi.getRequests,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    // Get user's requests
    const userRequestsQuery = useQuery({
        queryKey: requestKeys.userRequests(),
        queryFn: requestApi.getUserRequests,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    // Get request by ID
    const useRequestQuery = (id: number) => useQuery({
        queryKey: requestKeys.request(id),
        queryFn: () => requestApi.getRequestById(id),
        enabled: !!id,
    });

    // Create request mutation
    const createRequestMutation = useMutation({
        mutationFn: requestApi.createRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: requestKeys.userRequests() });
            queryClient.invalidateQueries({ queryKey: requestKeys.list() });
        },
    });

    // Approve request mutation
    const approveRequestMutation = useMutation({
        mutationFn: requestApi.approveRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: requestKeys.list() });
            queryClient.invalidateQueries({ queryKey: requestKeys.userRequests() });
            queryClient.invalidateQueries({ queryKey: requestKeys.request(data.requestId) });
        },
    });

    // Fulfill request mutation
    const fulfillRequestMutation = useMutation({
        mutationFn: requestApi.fulfillRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: requestKeys.list() });
            queryClient.invalidateQueries({ queryKey: requestKeys.userRequests() });
            queryClient.invalidateQueries({ queryKey: requestKeys.request(data.requestId) });
        },
    });

    return {
        // Queries
        requestsQuery,
        userRequestsQuery,
        useRequestQuery,
        
        // Mutations
        createRequestMutation,
        approveRequestMutation,
        fulfillRequestMutation,
    };
}
