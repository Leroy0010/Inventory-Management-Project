import apiClient from './client';
import type { 
  Notification, 
  GeneralNotificationRequest, 
  GeneralNotificationResponse,
  NotificationListResponse,
  NotificationFilters,
  NotificationPagination,
  AvailableUsers
} from '@/types/notification';


export const notificationApi = {
  // Get all notifications for a user
  getNotifications: async (
    filters?: NotificationFilters,
    pagination?: Partial<NotificationPagination>
  ): Promise<NotificationListResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());
    if (filters?.search) params.append('search', filters.search);
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.size) params.append('size', pagination.size.toString());

    const response = await apiClient.get(`/api/notifications?${params.toString()}`);
    return response.data;
  },

  // Get unread notifications only
  getUnreadNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get(`/api/notifications/unread`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get(`/api/notifications/count/unread`);
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/api/notifications/${notificationId}/mark-read`);
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (): Promise<void> => {
    await apiClient.put(`/api/notifications/mark-all-read`);
  },

  // Get notifications by type
  getNotificationsByType: async (type: string): Promise<Notification[]> => {
    const response = await apiClient.get(`/api/notifications/filter?type=${type}`);
    return response.data;
  },

  // Delete old notifications
  deleteOldNotifications: async (daysOld: number): Promise<void> => {
    await apiClient.delete(`/api/notifications/delete-all-old?daysOld=${daysOld}`);
  },

  // Send general notification
  sendGeneralNotification: async (data: GeneralNotificationRequest): Promise<GeneralNotificationResponse> => {
    const response = await apiClient.post('/api/general-notifications/send', data);
    return response.data;
  },

  // Get available users for notification
  getAvailableUsers: async (): Promise<AvailableUsers> => {
    const response = await apiClient.get('/api/general-notifications/available-users');
    return response.data;
  },
};
