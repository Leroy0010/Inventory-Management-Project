// Notification Types
export const NotificationType = {
    NEW_REQUEST: 'NEW_REQUEST',
    REQUEST_APPROVED: 'REQUEST_APPROVED',
    REQUEST_REJECTED: 'REQUEST_REJECTED',
    REQUEST_FULFILLED: 'REQUEST_FULFILLED',
    LOW_STOCK: 'LOW_STOCK',
    GENERAL: 'GENERAL',
} as const;

export const RecipientType = {
    ALL_USERS: 'ALL_USERS',
    DEPARTMENT_USERS: 'DEPARTMENT_USERS',
    SPECIFIC_USERS: 'SPECIFIC_USERS',
} as const;

export type NotificationType =
    (typeof NotificationType)[keyof typeof NotificationType];
export type RecipientType = (typeof RecipientType)[keyof typeof RecipientType];

// Core notification interfaces
export interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    type: NotificationType;
    requestId?: number;
    itemId?: number;
    createdAt: string;
}

// Legacy notification interface for backward compatibility (from index.ts)
export interface LegacyNotification {
    id: string;
    type: LegacyNotificationType;
    title: string;
    message: string;
    userId: string;
    read: boolean;
    data?: Record<string, string>;
    createdAt: string;
}

// Legacy notification types (from index.ts)
export const LegacyNotificationType = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
    REQUEST: 'REQUEST',
    INVENTORY_ALERT: 'INVENTORY_ALERT',
} as const;

export type LegacyNotificationType =
    (typeof LegacyNotificationType)[keyof typeof LegacyNotificationType];

export interface WebSocketNotification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    type: NotificationType;
    requestId?: number;
    itemId?: number;
    createdAt: string;
}

// API Request/Response types
export interface GeneralNotificationRequest {
    subject: string;
    message: string;
    recipientType: RecipientType;
    userEmails?: string[];
}

export interface GeneralNotificationResponse {
    message: string;
}

export type AvailableUsers = string[];

export interface NotificationMarkReadResponse {
    message: string;
}

// Filter and pagination types
export interface NotificationFilters {
    type?: NotificationType;
    read?: boolean;
    search?: string;
}

export interface NotificationPagination {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

export interface NotificationListResponse {
    notifications: Notification[];
    pagination: NotificationPagination;
}

// WebSocket types
export interface WebSocketMessage {
    type: 'notification';
    data: WebSocketNotification;
}

export interface WebSocketConnectionState {
    connected: boolean;
    connecting: boolean;
    error: string | null;
}

// UI State types
export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    filters: NotificationFilters;
    pagination: NotificationPagination;
}

// Toast notification types
export interface ToastNotification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

// Notification preferences
export interface NotificationPreferences {
    emailNotifications: boolean;
    pushNotifications: boolean;
    types: {
        [key in NotificationType]: boolean;
    };
}

// Helper type for notification type checking
export type RequestRelatedType =
    | typeof NotificationType.NEW_REQUEST
    | typeof NotificationType.REQUEST_APPROVED
    | typeof NotificationType.REQUEST_REJECTED
    | typeof NotificationType.REQUEST_FULFILLED;

export type ItemRelatedType = typeof NotificationType.LOW_STOCK;

export type GeneralType = typeof NotificationType.GENERAL;

// Utility type for notification type categorization
export type NotificationCategory = 'request' | 'item' | 'general';

// Notification action types
export interface NotificationAction {
    type: 'mark_read' | 'mark_all_read' | 'delete' | 'navigate';
    notificationId?: number;
    targetPage?: string;
    targetId?: number;
}

// Context-specific types (from NotificationContext)
export type ContextNotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'REMOVE_NOTIFICATION'; payload: string }
    | { type: 'MARK_AS_READ'; payload: string }
    | { type: 'MARK_ALL_AS_READ' }
    | { type: 'CLEAR_ALL' }
    | { type: 'SET_NOTIFICATIONS'; payload: Notification[] };

export interface ContextNotificationState {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
}

export interface NotificationContextType extends ContextNotificationState {
    addNotification: (
        notification: Omit<Notification, 'id' | 'createdAt'>
    ) => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}
