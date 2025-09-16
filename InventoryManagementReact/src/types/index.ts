// Re-export types from auth.ts for convenience
export type { User, Role } from './auth';

// Inventory Types
export interface InventoryItem {
    id: string;
    name: string;
    description: string;
    category: string;
    sku: string;
    quantity: number;
    minQuantity: number;
    maxQuantity: number;
    unitPrice: number;
    location: string;
    batchId?: string;
    officeId: string;
    status: InventoryStatus;
    createdAt: string;
    updatedAt: string;
}

export const InventoryStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DISCONTINUED: 'DISCONTINUED',
} as const;

export type InventoryStatus =
    (typeof InventoryStatus)[keyof typeof InventoryStatus];

// Staff Types
export interface Staff {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    officeId: string;
    role: string;
    isActive: boolean;
    hireDate: string;
    createdAt: string;
    updatedAt: string;
}

// Office Types
export interface Office {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
    managerId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Batch Types
export interface Batch {
    id: string;
    batchNumber: string;
    name: string;
    description: string;
    officeId: string;
    status: BatchStatus;
    createdAt: string;
    updatedAt: string;
}

export const BatchStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    ARCHIVED: 'ARCHIVED',
} as const;

export type BatchStatus = (typeof BatchStatus)[keyof typeof BatchStatus];

// Request Types
export interface Request {
    id: string;
    type: RequestType;
    title: string;
    description: string;
    requesterId: string;
    approverId?: string;
    status: RequestStatus;
    priority: RequestPriority;
    items: RequestItem[];
    createdAt: string;
    updatedAt: string;
}

export const RequestType = {
    INVENTORY_REQUEST: 'INVENTORY_REQUEST',
    APPROVAL_REQUEST: 'APPROVAL_REQUEST',
    TRANSFER_REQUEST: 'TRANSFER_REQUEST',
} as const;

export type RequestType = (typeof RequestType)[keyof typeof RequestType];

export const RequestStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const RequestPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
} as const;

export type RequestPriority =
    (typeof RequestPriority)[keyof typeof RequestPriority];

export interface RequestItem {
    id: string;
    inventoryItemId: string;
    quantity: number;
    notes?: string;
}

// Notification Types - moved to notification.ts
// Re-export for backward compatibility
export type { 
    Notification as LegacyNotification,
    NotificationType as LegacyNotificationType 
} from './notification';

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    message: string;
    success: boolean;
    timestamp: string;
}

