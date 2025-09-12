import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api, handleApiError } from '@/api/client';

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

export interface RequestState {
    requests: Request[];
    userRequests: Request[];
    isLoading: boolean;
    error: string | null;
    selectedRequest: Request | null;
    filters: {
        status?: string;
        userId?: number;
        dateFrom?: string;
        dateTo?: string;
    };
}

export interface RequestActions {
    // Request management
    fetchRequests: () => Promise<void>;
    fetchUserRequests: () => Promise<void>;
    fetchRequestById: (id: number) => Promise<Request | null>;
    createRequest: (request: CreateRequestDto) => Promise<Request>;
    approveRequest: (approval: ApproveRequestDto) => Promise<void>;
    fulfillRequest: (fulfillment: RequestFulfillmentDto) => Promise<void>;

    // Filters and search
    setFilters: (filters: Partial<RequestState['filters']>) => void;
    clearFilters: () => void;
    setSelectedRequest: (request: Request | null) => void;

    // Error handling
    setError: (error: string | null) => void;
    clearError: () => void;
}

export type RequestStore = RequestState & RequestActions;

// Initial state
const initialState: RequestState = {
    requests: [],
    userRequests: [],
    isLoading: false,
    error: null,
    selectedRequest: null,
    filters: {},
};

// Request store
export const useRequestStore = create<RequestStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Fetch all requests (for storekeepers/admins)
            fetchRequests: async () => {
                set({ isLoading: true, error: null });

                try {
                    const requests = await api.get<Request[]>('/api/requests');
                    set({ requests: requests || [], isLoading: false });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                }
            },

            // Fetch user's requests
            fetchUserRequests: async () => {
                set({ isLoading: true, error: null });

                try {
                    const requests = await api.get<Request[]>('/api/requests');
                    set({ userRequests: requests || [], isLoading: false });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                }
            },

            // Fetch request by ID
            fetchRequestById: async (id: number) => {
                try {
                    const request = await api.get<Request>(`/api/requests/${id}`);
                    return request;
                } catch (error) {
                    set({
                        error: handleApiError(error),
                    });
                    return null;
                }
            },

            // Create new request
            createRequest: async (request: CreateRequestDto) => {
                set({ isLoading: true, error: null });

                try {
                    const newRequest = await api.post<Request>('/api/requests', request);

                    set((state) => ({
                        userRequests: [...state.userRequests, newRequest],
                        isLoading: false,
                    }));

                    return newRequest;
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Approve or reject request
            approveRequest: async (approval: ApproveRequestDto) => {
                set({ isLoading: true, error: null });

                try {
                    await api.put('/api/requests/approve', approval);

                    // Update the request in the store
                    set((state) => ({
                        requests: state.requests.map((req) =>
                            req.id === approval.requestId
                                ? {
                                      ...req,
                                      status: approval.approved
                                          ? 'APPROVED'
                                          : 'REJECTED',
                                  }
                                : req
                        ),
                        userRequests: state.userRequests.map((req) =>
                            req.id === approval.requestId
                                ? {
                                      ...req,
                                      status: approval.approved
                                          ? 'APPROVED'
                                          : 'REJECTED',
                                  }
                                : req
                        ),
                        isLoading: false,
                    }));
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Fulfill request
            fulfillRequest: async (fulfillment: RequestFulfillmentDto) => {
                set({ isLoading: true, error: null });

                try {
                    await api.post('/api/requests/fulfil', fulfillment);

                    // Update the request in the store
                    set((state) => ({
                        requests: state.requests.map((req) =>
                            req.id === fulfillment.requestId
                                ? { ...req, status: 'FULFILLED' }
                                : req
                        ),
                        userRequests: state.userRequests.map((req) =>
                            req.id === fulfillment.requestId
                                ? { ...req, status: 'FULFILLED' }
                                : req
                        ),
                        isLoading: false,
                    }));
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Set filters
            setFilters: (filters) => {
                set((state) => ({
                    filters: { ...state.filters, ...filters },
                }));
            },

            // Clear filters
            clearFilters: () => {
                set({ filters: {} });
            },

            // Set selected request
            setSelectedRequest: (request) => {
                set({ selectedRequest: request });
            },

            // Set error
            setError: (error) => {
                set({ error });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'request-store',
        }
    )
);
