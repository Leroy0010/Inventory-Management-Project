import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from './queries/useNotification';
import { getStompClient } from '@/lib/stompClient';
import { toast } from '@/hooks/useToast';
import type { WebSocketNotification, WebSocketConnectionState } from '@/types/notification';
import type {Frame} from "@stomp/stompjs";

export function useWebSocketNotification(batchWindowMs = 1500) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const subscriptionIdRef = useRef<string | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const notificationQueueRef = useRef<WebSocketNotification[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>({
    connected: false,
    connecting: false,
    error: null,
  });

  const [unreadCount, setUnreadCount] = useState<number>(0);

  const enqueueNotification = useCallback((notification: WebSocketNotification) => {
    notificationQueueRef.current.push(notification);
    setUnreadCount((prev) => prev + 1);

    if (!batchTimeoutRef.current) {
      batchTimeoutRef.current = setTimeout(() => {
        flushNotificationBatch();
      }, batchWindowMs);
    }
  }, [batchWindowMs]);

  const flushNotificationBatch = useCallback(() => {
    const queued = [...notificationQueueRef.current];
    notificationQueueRef.current = [];
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
      batchTimeoutRef.current = null;
    }

    if (!queued.length) return;

    // Update query cache
    queryClient.setQueriesData({ queryKey: notificationKeys.all }, (oldData: any) => {
      if (oldData?.notifications) {
        return { ...oldData, notifications: [...queued, ...oldData.notifications] };
      }
      return oldData;
    });

    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: notificationKeys.count(user.id) });
    }

    // Show batched toasts
    if (queued.length === 1) showSingleNotification(queued[0]);
    else showBatchedNotification(queued);

    // Browser notifications individually
    queued.forEach((n) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(n.title, { body: n.message, icon: '/favicon.ico' });
      }
    });
  }, [queryClient, user?.id]);

  const showSingleNotification = (notification: WebSocketNotification) => {
    toast({ title: notification.title, description: notification.message, variant: getToastVariant(notification.type), duration: 5000 });
  };

  const showBatchedNotification = (notifications: WebSocketNotification[]) => {
    toast({
      title: `You have ${notifications.length} new notifications`,
      description: notifications.map((n) => `• ${n.title}`).join('\n'),
      variant: 'info',
      duration: 4000 + notifications.length * 1000,
    });
  };

  const getToastVariant = (type: string) => {
    switch (type) {
      case 'REQUEST_APPROVED': return 'success';
      case 'REQUEST_REJECTED': return 'destructive';
      case 'LOW_STOCK': return 'warning';
      case 'NEW_REQUEST': return 'info';
      default: return 'default';
    }
  };

  const connectAndSubscribe = useCallback(async () => {
    if (!user?.id) return;
    const stompClient = getStompClient();
    setConnectionState({ connected: false, connecting: true, error: null });

    try {
      await stompClient.connect();
      setConnectionState({ connected: true, connecting: false, error: null });
      reconnectAttemptsRef.current = 0;

      // Subscribe to user's notifications
      const subscriptionId = stompClient.subscribeToUserNotifications(user.id, enqueueNotification);
      subscriptionIdRef.current = subscriptionId;

      flushNotificationBatch();

      // Handle disconnect
      const originalOnDisconnect = stompClient['client']?.onDisconnect;
      stompClient['client']!.onDisconnect = (frame?: Frame) => {
        setConnectionState({ connected: false, connecting: false, error: 'Disconnected' });
        attemptReconnect();
        originalOnDisconnect?.(frame as Frame);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setConnectionState({ connected: false, connecting: false, error: error instanceof Error ? error.message : 'Connection failed' });
      attemptReconnect();
    }
  }, [user?.id, enqueueNotification, flushNotificationBatch]);

  const attemptReconnect = useCallback(() => {
    const maxAttempts = 5;
    const baseDelay = 2000;

    if (reconnectAttemptsRef.current >= maxAttempts) return;

    reconnectAttemptsRef.current += 1;
    const delay = baseDelay * reconnectAttemptsRef.current ** 2;
    console.log(`Attempting reconnect in ${delay / 1000}s (attempt ${reconnectAttemptsRef.current})`);
    reconnectTimeoutRef.current = setTimeout(connectAndSubscribe, delay);
  }, [connectAndSubscribe]);

  useEffect(() => {
    if (!user?.id) return;

    connectAndSubscribe();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);

      const stompClient = getStompClient();
      if (subscriptionIdRef.current) {
        stompClient.unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
      stompClient.disconnect();
      setConnectionState({ connected: false, connecting: false, error: null });
    };
  }, [user?.id, connectAndSubscribe]);

  // Reset unread count manually if needed
  const resetUnreadCount = useCallback(() => setUnreadCount(0), []);

  return {
    connectionState,
    unreadCount,
    resetUnreadCount,
  };
}
