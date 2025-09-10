import { api, handleApiError } from './client';

// Types
export interface Request {
    id: number;
    userId: number;
    items: RequestItem[];
    status: string;
    submittedAt: string;
    approvedAt?: string;
    approver?: User;
    fulfilledAt?: string;
    fulfiller?: User;
    statusHistory: RequestStatusHistory[];
}

export interface RequestItem {
    id: number;
    itemId: number;
    quantity: number;
    inventoryItem: InventoryItem;
}

export interface RequestStatusHistory {
    id: number;
    status: string;
    changedAt: string;
    changedBy: User;
    comment?: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: Role;
}

export interface Role {
    id: number;
    name: string;
}

export interface InventoryItem {
    id: number;
    name: string;
    description: string;
    unit: string;
    department: Department;
}

export interface Department {
    id: number;
    name: string;
}

export interface CreateRequestDto {
    items: RequestItemDto[];
}

export interface RequestItemDto {
    itemId: number;
    quantity: number;
}

export interface ApproveRequestDto {
    requestId: number;
    approved: boolean;
    comment?: string;
}

export interface RequestFulfillmentDto {
    requestId: number;
    comment?: string;
}

// Request API functions
export const requestApi = {
    // Get all requests (for storekeepers/admins)
    getRequests: async (): Promise<Request[]> => {
        try {
            return await api.get<Request[]>('/api/requests');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get user's requests
    getUserRequests: async (): Promise<Request[]> => {
        try {
            return await api.get<Request[]>('/api/requests');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get request by ID
    getRequestById: async (id: number): Promise<Request> => {
        try {
            return await api.get<Request>(`/api/requests/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Create new request
    createRequest: async (request: CreateRequestDto): Promise<Request> => {
        try {
            return await api.post<Request>('/api/requests', request);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Approve or reject request
    approveRequest: async (
        approval: ApproveRequestDto
    ): Promise<ApproveRequestDto> => {
        try {
            return await api.put<ApproveRequestDto>(
                '/api/requests/approve',
                approval
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Fulfill request
    fulfillRequest: async (
        fulfillment: RequestFulfillmentDto
    ): Promise<RequestFulfillmentDto> => {
        try {
            return await api.post<RequestFulfillmentDto>(
                '/api/requests/fulfil',
                fulfillment
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
