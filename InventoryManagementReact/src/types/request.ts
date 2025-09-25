import type { RequestStatusHistoryDto } from './requestStatusHistory';
import type { UserResponseDto } from './user';

export interface RequestItemResponseDto {
    id: number;
    name: string;
    quantity: number;
}

export interface RequestResponseDto {
    id: number;
    user_id: number; // ID of requester
    items: RequestItemResponseDto[];
    status: RequestStatus;
    submittedAt: string; // ISO string from LocalDateTime
    approvedAt?: string; // ISO string from LocalDateTime
    fulfilledAt?: string; // ISO string from LocalDateTime
    approver?: UserResponseDto;
    fulfiller?: UserResponseDto;
    statusHistory: RequestStatusHistoryDto[];
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'FULFILLED' | 'REJECTED';

// Request DTOs for API operations
export interface ApproveRequestDto {
    id: number;
    status: RequestStatus;
    approve: boolean;
}

export interface RequestFulfillmentDto {
    requestId: number;
    status: RequestStatus;
    fulfilled: boolean;
    comment?: string;
}

export interface CreateRequestDto {
    items: RequestItemDto[];
}

export interface RequestItemDto {
    itemId: number;
    quantity: number;
}
