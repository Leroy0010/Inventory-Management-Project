import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
    Notification,
    NotificationState,
    NotificationFilters,
    NotificationPagination,
    ToastNotification,
} from '@/types/notification';

interface NotificationStore extends NotificationState {
    // Actions
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    updateNotification: (id: number, updates: Partial<Notification>) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    setFilters: (filters: Partial<NotificationFilters>) => void;
    setPagination: (pagination: Partial<NotificationPagination>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Toast notifications
    toasts: ToastNotification[];
    addToast: (toast: Omit<ToastNotification, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    filters: {},
    pagination: {
        page: 1,
        size: 20,
        total: 0,
        totalPages: 0,
    },
};

export const useNotificationStore = create<NotificationStore>()(
    devtools(
        (set, get) => ({
            ...initialState,
            toasts: [],

            // Notification management
            setNotifications: (notifications) => {
                const unreadCount = notifications.filter((n) => !n.read).length;
                set({
                    notifications,
                    unreadCount,
                    error: null,
                });
            },

            addNotification: (notification) => {
                const { notifications } = get();
                const updatedNotifications = [notification, ...notifications];
                const unreadCount = updatedNotifications.filter(
                    (n) => !n.read
                ).length;

                set({
                    notifications: updatedNotifications,
                    unreadCount,
                });
            },

            updateNotification: (id, updates) => {
                const { notifications } = get();
                const updatedNotifications = notifications.map((n) =>
                    n.id === id ? { ...n, ...updates } : n
                );
                const unreadCount = updatedNotifications.filter(
                    (n) => !n.read
                ).length;

                set({
                    notifications: updatedNotifications,
                    unreadCount,
                });
            },

            markAsRead: (id) => {
                const { notifications } = get();
                const updatedNotifications = notifications.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                );
                const unreadCount = updatedNotifications.filter(
                    (n) => !n.read
                ).length;

                set({
                    notifications: updatedNotifications,
                    unreadCount,
                });
            },

            markAllAsRead: () => {
                const { notifications } = get();
                const updatedNotifications = notifications.map((n) => ({
                    ...n,
                    isRead: true,
                }));

                set({
                    notifications: updatedNotifications,
                    unreadCount: 0,
                });
            },

            // Filter and pagination
            setFilters: (filters) => {
                set((state) => ({
                    filters: { ...state.filters, ...filters },
                    pagination: { ...state.pagination, page: 1 }, // Reset to first page
                }));
            },

            setPagination: (pagination) => {
                set((state) => ({
                    pagination: { ...state.pagination, ...pagination },
                }));
            },

            // Loading and error states
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            // Toast management
            addToast: (toast) => {
                const id = Math.random().toString(36).substr(2, 9);
                const newToast = { ...toast, id };

                set((state) => ({
                    toasts: [...state.toasts, newToast],
                }));

                // Auto-remove toast after duration
                if (toast.duration !== 0) {
                    setTimeout(() => {
                        get().removeToast(id);
                    }, toast.duration || 5000);
                }
            },

            removeToast: (id) => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                }));
            },

            clearToasts: () => set({ toasts: [] }),
        }),
        {
            name: 'notification-store',
        }
    )
);
