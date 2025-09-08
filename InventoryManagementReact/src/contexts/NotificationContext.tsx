import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { Notification, NotificationType } from '@/types';

// Notification Actions
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] };

// Notification State
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
}

// Initial State
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false
};

// Notification Reducer
function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'REMOVE_NOTIFICATION':
      const notificationToRemove = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: notificationToRemove && !notificationToRemove.isRead 
          ? state.unreadCount - 1 
          : state.unreadCount
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length
      };
    default:
      return state;
  }
}

// Notification Context
interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  connect: () => void;
  disconnect: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification Provider
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [stompClient, setStompClient] = React.useState<any>(null);

  // STOMP WebSocket connection
  const connect = useCallback(() => {
    // TODO: Implement actual STOMP connection
    // For now, we'll simulate the connection
    console.log('Connecting to STOMP...');
    setStompClient({ connected: true });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
  }, []);

  const disconnect = useCallback(() => {
    if (stompClient) {
      // TODO: Implement actual STOMP disconnection
      console.log('Disconnecting from STOMP...');
      setStompClient(null);
    }
  }, [stompClient]);

  // Connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  }, []);

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
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    connect,
    disconnect
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
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper function to create notifications
export function createNotification(
  type: NotificationType,
  title: string,
  message: string,
  userId: string,
  data?: Record<string, any>
): Omit<Notification, 'id' | 'createdAt'> {
  return {
    type,
    title,
    message,
    userId,
    isRead: false,
    data
  };
}
