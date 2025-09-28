import { useWebSocketNotification } from '@/hooks/useWebSocketNotification';
import type {
    ContextNotificationAction,
    ContextNotificationState,
    Notification,
    NotificationContextType,
    NotificationType,
} from '@/types/notification';
import { useQueryClient } from '@tanstack/react-query';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react';

// Initial State
const initialState: ContextNotificationState = {
    notifications: [],
    unreadCount: 0,
    isConnected: false,
};

// Notification Reducer
function notificationReducer(
    state: ContextNotificationState,
    action: ContextNotificationAction
): ContextNotificationState {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            };
        case 'REMOVE_NOTIFICATION': {
            const notificationToRemove = state.notifications.find(
                (n) => n.id.toString() === action.payload
            );
            return {
                ...state,
                notifications: state.notifications.filter(
                    (n) => n.id.toString() !== action.payload
                ),
                unreadCount:
                    notificationToRemove && !notificationToRemove.read
                        ? state.unreadCount - 1
                        : state.unreadCount,
            };
        }
        case 'MARK_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map((n) =>
                    n.id.toString() === action.payload
                        ? { ...n, read: true }
                        : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            };
        case 'MARK_ALL_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map((n) => ({
                    ...n,
                    isRead: true,
                })),
                unreadCount: 0,
            };
        case 'CLEAR_ALL':
            return {
                ...state,
                notifications: [],
                unreadCount: 0,
            };
        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload,
                unreadCount: action.payload.filter((n) => !n.read).length,
            };
        default:
            return state;
    }
}

export const NotificationContext = createContext<
    NotificationContextType | undefined
>(undefined);

// Notification Provider
export function NotificationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, dispatch] = useReducer(notificationReducer, initialState);
    const { connectionState, unreadCount: wsUnreadCount } =
        useWebSocketNotification();
    const queryClient = useQueryClient();

    // Update connection state in context
    useEffect(() => {
        dispatch({
            type: 'SET_NOTIFICATIONS',
            payload: state.notifications,
        });
    }, [connectionState.connected]);

    // Connect on mount
    useEffect(() => {}, []);

    const addNotification = useCallback(
        (notification: Omit<Notification, 'id' | 'createdAt'>) => {
            const newNotification: Notification = {
                ...notification,
                id: Date.now(),
                createdAt: new Date().toISOString(),
            };
            dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
        },
        []
    );

    const removeNotification = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, []);

    const markAsRead = useCallback((id: string) => {
        dispatch({ type: 'MARK_AS_READ', payload: id });
    }, []);

    const markAllAsRead = useCallback(() => {
        dispatch({ type: 'MARK_ALL_AS_READ' });
    }, []);

    const clearAll = useCallback(() => {
        dispatch({ type: 'CLEAR_ALL' });
    }, []);

    const value: NotificationContextType = {
        ...state,
        isConnected: connectionState.connected,
        unreadCount: wsUnreadCount, // Use WebSocket unread count
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

// Notification Hook
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            'useNotifications must be used within a NotificationProvider'
        );
    }
    return context;
}

// Helper function to create notifications
export function createNotification(
    type: NotificationType,
    title: string,
    message: string,
    requestId?: number,
    itemId?: number
): Omit<Notification, 'id' | 'createdAt'> {
    return {
        type,
        title,
        message,
        read: false,
        requestId,
        itemId,
    };
}
