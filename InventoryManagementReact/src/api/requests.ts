import { api, handleApiError } from './client';
import type {
    RequestResponseDto,
    ApproveRequestDto,
    RequestFulfillmentDto,
    CreateRequestDto,
} from '@/types/request';

// Request API functions based on Spring Boot RequestController
export const requestApi = {
    // Get user's requests (role-based: staff see their own, storekeepers see department requests)
    getUserRequests: async (): Promise<RequestResponseDto[]> => {
        try {
            return await api.get<RequestResponseDto[]>('/api/requests');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get request by ID
    getRequestById: async (id: number): Promise<RequestResponseDto> => {
        try {
            return await api.get<RequestResponseDto>(`/api/requests/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Submit cart as request (staff only)
    submitCartAsRequest: async (): Promise<RequestResponseDto> => {
        try {
            return await api.post<RequestResponseDto>('/api/requests');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Create new request with items
    createRequest: async (request: CreateRequestDto): Promise<RequestResponseDto> => {
        try {
            return await api.post<RequestResponseDto>('/api/requests', request);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Approve or reject request (storekeeper only)
    approveOrRejectRequest: async (approval: ApproveRequestDto): Promise<RequestResponseDto> => {
        try {
            return await api.put<RequestResponseDto>('/api/requests/approve', approval);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Fulfill request (staff only)
    fulfillRequest: async (fulfillment: RequestFulfillmentDto): Promise<RequestResponseDto> => {
        try {
            return await api.post<RequestResponseDto>('/api/requests/fulfil', fulfillment);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};