import {
    pushNotificationApi,
    type PushSubscriptionData,
} from '@/api/pushNotifications';

// Service Worker Registration for Background Notifications
export class ServiceWorkerManager {
    private static instance: ServiceWorkerManager;
    private registration: ServiceWorkerRegistration | null = null;
    private pushManager: PushManager | null = null;
    private subscription: PushSubscription | null = null;

    private constructor() {}

    static getInstance(): ServiceWorkerManager {
        if (!ServiceWorkerManager.instance) {
            ServiceWorkerManager.instance = new ServiceWorkerManager();
        }
        return ServiceWorkerManager.instance;
    }

    async register(): Promise<boolean> {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return false;
        }

        try {
            this.registration =
                await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', this.registration);

            // Wait for the service worker to be ready
            await navigator.serviceWorker.ready;
            console.log('Service Worker ready');

            // Set up push manager
            this.pushManager = this.registration.pushManager;

            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }

    async requestNotificationPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            throw new Error('Notifications not supported');
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission === 'denied') {
            throw new Error('Notification permission denied');
        }

        const permission = await Notification.requestPermission();
        return permission;
    }

    async subscribeToPush(): Promise<PushSubscription | null> {
        if (!this.pushManager) {
            throw new Error('Push Manager not available');
        }

        try {
            // Check if already subscribed
            this.subscription = await this.pushManager.getSubscription();

            if (this.subscription) {
                console.log('Already subscribed to push notifications');
                return this.subscription;
            }

            // Subscribe to push notifications
            this.subscription = await this.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    process.env.VITE_VAPID_PUBLIC_KEY ||
                        'BEqA-s8JXB450K8KblHvwC0l2oOLviV7_zh8ntpmTzKoGv7vAASqTpbgoENGqLCL2wUrvSLopkLfOEabvH1XU_8'
                ),
            });

            console.log('Subscribed to push notifications:', this.subscription);
            return this.subscription;
        } catch (error) {
            console.error('Push subscription failed:', error);
            return null;
        }
    }

    async unsubscribeFromPush(): Promise<boolean> {
        if (!this.subscription) {
            return true;
        }

        try {
            const result = await this.subscription.unsubscribe();
            this.subscription = null;
            console.log('Unsubscribed from push notifications');
            return result;
        } catch (error) {
            console.error('Push unsubscription failed:', error);
            return false;
        }
    }

    getSubscription(): PushSubscription | null {
        return this.subscription;
    }

    async sendSubscriptionToServer(): Promise<boolean> {
        if (!this.subscription) {
            return false;
        }

        try {
            // Convert PushSubscription to the format expected by the API
            const subscriptionData: PushSubscriptionData = {
                endpoint: this.subscription.endpoint,
                keys: {
                    p256dh: this.getKeyFromSubscription('p256dh'),
                    auth: this.getKeyFromSubscription('auth'),
                },
            };

            const response =
                await pushNotificationApi.subscribe(subscriptionData);

            if (response.success) {
                console.log('Subscription sent to server successfully');
                return true;
            } else {
                console.error(
                    'Failed to send subscription to server:',
                    response.message
                );
                return false;
            }
        } catch (error) {
            console.error('Error sending subscription to server:', error);
            return false;
        }
    }

    private getKeyFromSubscription(keyName: 'p256dh' | 'auth'): string {
        if (!this.subscription) {
            throw new Error('No subscription available');
        }

        const key = this.subscription.getKey(keyName);
        if (!key) {
            throw new Error(`Key ${keyName} not found in subscription`);
        }

        // Convert ArrayBuffer to base64
        const bytes = new Uint8Array(key);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    private getCurrentUserId(): number | null {
        // Get user ID from auth store or localStorage
        try {
            const authData = localStorage.getItem('auth-storage');
            if (authData) {
                const parsed = JSON.parse(authData);
                return parsed.state?.user?.id || null;
            }
        } catch (error) {
            console.error('Error getting user ID:', error);
        }
        return null;
    }

    async isSupported(): Promise<boolean> {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    }

    async getPermissionState(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            return 'denied';
        }
        return Notification.permission;
    }

    /**
     * Send a test notification via the backend
     */
    async sendTestNotification(): Promise<boolean> {
        try {
            const response = await pushNotificationApi.sendTestNotification();
            return response.success;
        } catch (error) {
            console.error('Error sending test notification:', error);
            return false;
        }
    }

    /**
     * Get user's push subscriptions from the backend
     */
    async getSubscriptions() {
        try {
            return await pushNotificationApi.getSubscriptions();
        } catch (error) {
            console.error('Error getting subscriptions:', error);
            return [];
        }
    }

    /**
     * Unsubscribe from push notifications
     */
    async unsubscribeFromServer(subscriptionId: number): Promise<boolean> {
        try {
            const response =
                await pushNotificationApi.unsubscribe(subscriptionId);
            return response.success;
        } catch (error) {
            console.error('Error unsubscribing:', error);
            return false;
        }
    }
}

// Export singleton instance
export const serviceWorkerManager = ServiceWorkerManager.getInstance();
