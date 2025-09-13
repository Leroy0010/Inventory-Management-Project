import apiClient from './client';
import type { 
  Notification, 
  GeneralNotificationRequest, 
  GeneralNotificationResponse,
  NotificationListResponse,
  NotificationFilters,
  NotificationPagination
} from '@/types/notification';

export const notificationApi = {
  // Get all notifications for a user
  getNotifications: async (
    userId: number, 
    filters?: NotificationFilters,
    pagination?: Partial<NotificationPagination>
  ): Promise<NotificationListResponse> => {
    const params = new URLSearchParams();
    params.append('userId', userId.toString());
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());
    if (filters?.search) params.append('search', filters.search);
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.size) params.append('size', pagination.size.toString());

    const response = await apiClient.get(`/api/notifications?${params.toString()}`);
    return response.data;
  },

  // Get unread notifications only
  getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await apiClient.get(`/api/notifications/unread?userId=${userId}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (userId: number): Promise<number> => {
    const response = await apiClient.get(`/api/notifications/count/unread?userId=${userId}`);
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/api/notifications/${notificationId}/mark-read`);
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId: number): Promise<void> => {
    await apiClient.put(`/api/notifications/mark-all-read?userId=${userId}`);
  },

  // Get notifications by type
  getNotificationsByType: async (userId: number, type: string): Promise<Notification[]> => {
    const response = await apiClient.get(`/api/notifications/filter?userId=${userId}&type=${type}`);
    return response.data;
  },

  // Delete old notifications
  deleteOldNotifications: async (userId: number, daysOld: number): Promise<void> => {
    await apiClient.delete(`/api/notifications/delete-all-old?userId=${userId}&daysOld=${daysOld}`);
  },

  // Send general notification
  sendGeneralNotification: async (data: GeneralNotificationRequest): Promise<GeneralNotificationResponse> => {
    const response = await apiClient.post('/api/general-notifications/send', data);
    return response.data;
  },
};
