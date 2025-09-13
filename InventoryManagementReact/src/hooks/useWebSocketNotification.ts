import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from './queries/useNotification';
import type { WebSocketNotification, WebSocketConnectionState } from '@/types/notification';

// WebSocket hook for real-time notifications
export function useWebSocketNotification() {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>({
    connected: false,
    connecting: false,
    error: null,
  });

  const connect = useCallback(() => {
    if (!user?.id || !token || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/ws-notifications?token=${token}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionState({
          connected: true,
          connecting: false,
          error: null,
        });
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketNotification = JSON.parse(event.data);
          console.log('Received notification:', data);

          // Update the query cache with the new notification
          queryClient.setQueriesData(
            { queryKey: notificationKeys.all },
            (oldData: any) => {
              if (oldData?.notifications) {
                // Add new notification to the beginning of the list
                return {
                  ...oldData,
                  notifications: [data, ...oldData.notifications],
                };
              }
              return oldData;
            }
          );

          // Invalidate unread count to refetch
          queryClient.invalidateQueries({ 
            queryKey: notificationKeys.count(user.id) 
          });

          // Show toast notification (you can implement this separately)
          showToastNotification(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionState({
          connected: false,
          connecting: false,
          error: event.code !== 1000 ? 'Connection lost' : null,
        });

        // Attempt to reconnect after 3 seconds
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionState(prev => ({
          ...prev,
          connecting: false,
          error: 'Connection failed',
        }));
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionState({
        connected: false,
        connecting: false,
        error: 'Failed to connect',
      });
    }
  }, [user?.id, token, queryClient]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }

    setConnectionState({
      connected: false,
      connecting: false,
      error: null,
    });
  }, []);

  // Connect on mount and when user/token changes
  useEffect(() => {
    if (user?.id && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user?.id, token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    connect,
    disconnect,
  };
}

// Toast notification function (you can replace this with your preferred toast library)
function showToastNotification(notification: WebSocketNotification) {
  // This is a simple implementation - you might want to use a proper toast library
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
    });
  } else if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    });
  }
}
