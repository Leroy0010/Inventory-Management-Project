import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/api/notification';
import type { 
  Notification, 
  GeneralNotificationRequest,
  NotificationFilters,
  NotificationPagination
} from '@/types/notification';
import { useAuthStore } from '@/stores/authStore';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (userId: number, filters?: NotificationFilters, pagination?: Partial<NotificationPagination>) => 
    [...notificationKeys.lists(), userId, filters, pagination] as const,
  unread: (userId: number) => [...notificationKeys.all, 'unread', userId] as const,
  count: (userId: number) => [...notificationKeys.all, 'count', userId] as const,
  byType: (userId: number, type: string) => [...notificationKeys.all, 'byType', userId, type] as const,
};

// Hook for getting all notifications
export function useNotifications(
  filters?: NotificationFilters,
  pagination?: Partial<NotificationPagination>
) {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: notificationKeys.list(userId!, filters, pagination),
    queryFn: () => notificationApi.getNotifications(filters, pagination),
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

// Hook for getting unread notifications
export function useUnreadNotifications() {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: notificationKeys.unread(userId!),
    queryFn: () => notificationApi.getUnreadNotifications(),
    enabled: !!userId,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
}

// Hook for getting unread count
export function useUnreadCount() {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: notificationKeys.count(userId!),
    queryFn: () => notificationApi.getUnreadCount(),
    enabled: !!userId,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
}

// Hook for getting notifications by type
export function useNotificationsByType(type: string) {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: notificationKeys.byType(userId!, type),
    queryFn: () => notificationApi.getNotificationsByType(type),
    enabled: !!userId && !!type,
    staleTime: 60000, // 1 minute
  });
}

// Hook for marking notification as read
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: (_, notificationId) => {
      // Invalidate and refetch unread notifications and count
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      
      // Optimistically update the specific notification in all queries
      queryClient.setQueriesData(
        { queryKey: notificationKeys.all },
        (oldData: any) => {
          if (oldData?.notifications) {
            return {
              ...oldData,
              notifications: oldData.notifications.map((n: Notification) =>
                n.id === notificationId ? { ...n, isRead: true } : n
              ),
            };
          }
          return oldData;
        }
      );
    },
  });
}

// Hook for marking all notifications as read
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      
      // Optimistically update all notifications to read
      queryClient.setQueriesData(
        { queryKey: notificationKeys.all },
        (oldData: any) => {
          if (oldData?.notifications) {
            return {
              ...oldData,
              notifications: oldData.notifications.map((n: Notification) => ({
                ...n,
                isRead: true,
              })),
            };
          }
          return oldData;
        }
      );
    },
  });
}

// Hook for sending general notifications
export function useSendGeneralNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.sendGeneralNotification,
    onSuccess: () => {
      // Invalidate notifications to show the new one
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// Hook for getting available users for notifications
export function useAvailableUsers() {
  return useQuery({
    queryKey: ['notifications', 'available-users'],
    queryFn: () => notificationApi.getAvailableUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for deleting old notifications
export function useDeleteOldNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ daysOld }: { daysOld: number }) =>
      notificationApi.deleteOldNotifications(daysOld),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// Combined hook for all notification operations
export function useNotificationQueries() {
  const notifications = useNotifications();
  const unreadNotifications = useUnreadNotifications();
  const unreadCount = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const sendGeneralNotification = useSendGeneralNotification();
  const deleteOldNotifications = useDeleteOldNotifications();

  return {
    notifications,
    unreadNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendGeneralNotification,
    deleteOldNotifications,
  };
}
