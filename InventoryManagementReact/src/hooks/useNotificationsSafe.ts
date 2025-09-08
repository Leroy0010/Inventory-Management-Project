import { useContext } from 'react';
import { NotificationContext } from '@/contexts/NotificationContext';

// Safe hook that handles missing NotificationProvider gracefully
export function useNotificationsSafe() {
  try {
    const context = useContext(NotificationContext);
    if (context === undefined) {
      // Return mock data when NotificationProvider is not available
      return {
        notifications: [],
        unreadCount: 0,
        isConnected: false,
        addNotification: () => {},
        removeNotification: () => {},
        markAsRead: () => {},
        markAllAsRead: () => {},
        clearAll: () => {},
        connect: () => {},
        disconnect: () => {}
      };
    }
    return context;
  } catch (error) {
    // Fallback for any other errors
    console.warn('NotificationProvider not available, using mock data');
    return {
      notifications: [],
      unreadCount: 0,
      isConnected: false,
      addNotification: () => {},
      removeNotification: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      clearAll: () => {},
      connect: () => {},
      disconnect: () => {}
    };
  }
}
