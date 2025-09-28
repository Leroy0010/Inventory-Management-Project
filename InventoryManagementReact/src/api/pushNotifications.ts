import apiClient from './client';

// Types for push notification API
export interface PushSubscriptionData {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface PushSubscriptionRequest {
    subscription: PushSubscriptionData;
}

export interface PushSubscriptionResponse {
    success: boolean;
    message: string;
    subscriptionId?: number;
}

export interface PushSubscription {
    id: number;
    endpoint: string;
    p256dhKey: string;
    authKey: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

/**
 * API service for push notification subscriptions
 */
export const pushNotificationApi = {
    /**
     * Subscribe to push notifications
     */
    async subscribe(
        subscription: PushSubscriptionData
    ): Promise<PushSubscriptionResponse> {
        const response = await apiClient.post<PushSubscriptionResponse>(
            '/notifications/subscribe',
            {
                subscription,
            }
        );
        return response.data;
    },

    /**
     * Send test notification
     */
    async sendTestNotification(): Promise<PushSubscriptionResponse> {
        const response = await apiClient.post<PushSubscriptionResponse>(
            '/notifications/test'
        );
        return response.data;
    },

    /**
     * Get user's push subscriptions
     */
    async getSubscriptions(): Promise<PushSubscription[]> {
        const response = await apiClient.get<PushSubscription[]>(
            '/notifications/subscriptions'
        );
        return response.data;
    },

    /**
     * Unsubscribe from push notifications
     */
    async unsubscribe(
        subscriptionId: number
    ): Promise<PushSubscriptionResponse> {
        const response = await apiClient.delete<PushSubscriptionResponse>(
            `/notifications/subscriptions/${subscriptionId}`
        );
        return response.data;
    },
};
