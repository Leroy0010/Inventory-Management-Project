import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/useToast';
import { serviceWorkerManager } from '@/lib/serviceWorker';

export interface NotificationPermissionState {
    isSupported: boolean;
    permission: NotificationPermission;
    isRequesting: boolean;
    error: string | null;
    isServiceWorkerReady: boolean;
    isPushSubscribed: boolean;
}

export function useNotificationPermission() {
    const [permission, setPermission] =
        useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);
    const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
    const [isPushSubscribed, setIsPushSubscribed] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initializeServiceWorker = useCallback(async () => {
        try {
            const isSupported = await serviceWorkerManager.isSupported();
            if (!isSupported) {
                setError('Service Worker or Push API not supported');
                return false;
            }

            const registered = await serviceWorkerManager.register();
            if (registered) {
                setIsServiceWorkerReady(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Service Worker initialization failed:', error);
            setError('Failed to initialize Service Worker');
            return false;
        }
    }, []);

    useEffect(() => {
        if ('Notification' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);
        }

        // Initialize service worker on mount
        initializeServiceWorker();
    }, [initializeServiceWorker]);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!isSupported) {
            toast({
                title: 'Not Supported',
                description: 'This browser does not support notifications.',
                variant: 'destructive',
            });
            return false;
        }

        if (permission === 'granted') {
            return true;
        }

        if (permission === 'default') {
            setIsRequesting(true);
            setError(null);

            try {
                // First ensure service worker is ready
                if (!isServiceWorkerReady) {
                    const swReady = await initializeServiceWorker();
                    if (!swReady) {
                        setError('Service Worker not ready');
                        setIsRequesting(false);
                        return false;
                    }
                }

                // Request notification permission
                const result =
                    await serviceWorkerManager.requestNotificationPermission();
                setPermission(result);

                if (result === 'granted') {
                    // Subscribe to push notifications
                    const subscription =
                        await serviceWorkerManager.subscribeToPush();
                    if (subscription) {
                        const serverSuccess =
                            await serviceWorkerManager.sendSubscriptionToServer();
                        if (serverSuccess) {
                            setIsPushSubscribed(true);
                        } else {
                            console.error(
                                'Failed to send subscription to server'
                            );
                            setError('Failed to send subscription to server');
                        }
                    }

                    toast({
                        title: 'Notifications Enabled',
                        description:
                            'You will now receive browser notifications, even when the app is closed.',
                        variant: 'success',
                    });
                    setIsRequesting(false);
                    return true;
                } else {
                    toast({
                        title: 'Notifications Blocked',
                        description:
                            'Please enable notifications in your browser settings.',
                        variant: 'destructive',
                    });
                    setIsRequesting(false);
                    return false;
                }
            } catch (error) {
                console.error(
                    'Error requesting notification permission:',
                    error
                );
                toast({
                    title: 'Error',
                    description: 'Failed to request notification permission.',
                    variant: 'destructive',
                });
                setError('Failed to request notification permission');
                setIsRequesting(false);
                return false;
            }
        }

        return false;
    }, [
        isSupported,
        permission,
        isServiceWorkerReady,
        initializeServiceWorker,
    ]);

    const showNotification = useCallback(
        (title: string, options?: NotificationOptions) => {
            // Check support directly instead of relying on state
            if (!('Notification' in window)) {
                console.warn('Notifications not supported');
                return;
            }

            const currentPermission = Notification.permission;
            if (currentPermission !== 'granted') {
                console.warn(
                    'Notification permission not granted, requesting permission...'
                );
                // Request permission and then show notification
                Notification.requestPermission().then((result) => {
                    if (result === 'granted') {
                        console.log('Permission granted, showing notification');
                        const notification = new Notification(title, {
                            icon: '/favicon.ico',
                            badge: '/favicon.ico',
                            tag: 'inventory-notification',
                            requireInteraction: false,
                            silent: false,
                            ...options,
                        });

                        // Auto-close after 5 seconds
                        setTimeout(() => {
                            notification.close();
                        }, 5000);
                    } else {
                        console.warn(
                            'Permission denied for browser notifications'
                        );
                    }
                });
                return;
            }

            try {
                const notification = new Notification(title, {
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'inventory-notification',
                    requireInteraction: false,
                    silent: false,
                    ...options,
                });

                // Auto-close after 5 seconds
                setTimeout(() => {
                    notification.close();
                }, 5000);

                console.log('Browser notification shown:', title);
            } catch (error) {
                console.error('Error showing browser notification:', error);
            }
        },
        [] // No dependencies since we check support and permission directly
    );

    const testNotification = useCallback(async () => {
        if (permission === 'granted') {
            // Try backend notification first
            try {
                const success =
                    await serviceWorkerManager.sendTestNotification();
                if (success) {
                    toast({
                        title: 'Test Notification Sent',
                        description:
                            'A test notification has been sent via the backend.',
                        variant: 'success',
                    });
                } else {
                    // Fallback to local notification
                    showNotification('Test Notification', {
                        body: 'This is a test notification to verify everything works correctly.',
                    });
                }
            } catch (error) {
                console.error('Backend test notification failed:', error);
                // Fallback to local notification
                showNotification('Test Notification', {
                    body: 'This is a test notification to verify everything works correctly.',
                });
            }
        } else {
            requestPermission().then(async (granted) => {
                if (granted) {
                    // Try backend notification first
                    try {
                        const success =
                            await serviceWorkerManager.sendTestNotification();
                        if (success) {
                            toast({
                                title: 'Test Notification Sent',
                                description:
                                    'A test notification has been sent via the backend.',
                                variant: 'success',
                            });
                        } else {
                            // Fallback to local notification
                            showNotification('Test Notification', {
                                body: 'This is a test notification to verify everything works correctly.',
                            });
                        }
                    } catch (error) {
                        console.error(
                            'Backend test notification failed:',
                            error
                        );
                        // Fallback to local notification
                        showNotification('Test Notification', {
                            body: 'This is a test notification to verify everything works correctly.',
                        });
                    }
                }
            });
        }
    }, [permission, showNotification, requestPermission]);

    const unsubscribeFromPush = useCallback(async () => {
        try {
            // First unsubscribe from the browser
            const browserSuccess =
                await serviceWorkerManager.unsubscribeFromPush();

            // Then get subscriptions from server and unsubscribe from all
            try {
                const subscriptions =
                    await serviceWorkerManager.getSubscriptions();
                for (const subscription of subscriptions) {
                    await serviceWorkerManager.unsubscribeFromServer(
                        subscription.id
                    );
                }
            } catch (error) {
                console.warn('Failed to unsubscribe from server:', error);
                // Continue even if server unsubscription fails
            }

            if (browserSuccess) {
                setIsPushSubscribed(false);
                toast({
                    title: 'Notifications Disabled',
                    description:
                        'You will no longer receive background notifications.',
                    variant: 'success',
                });
            }
            return browserSuccess;
        } catch (error) {
            console.error(
                'Failed to unsubscribe from push notifications:',
                error
            );
            return false;
        }
    }, []);

    return {
        permission,
        isSupported,
        isServiceWorkerReady,
        isPushSubscribed,
        isRequesting,
        error,
        requestPermission,
        showNotification,
        testNotification,
        unsubscribeFromPush,
        initializeServiceWorker,
    };
}
