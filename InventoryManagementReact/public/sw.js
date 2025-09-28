// Service Worker for Background Notifications
const CACHE_NAME = 'inventory-management-v1';
const NOTIFICATION_TAG = 'inventory-notification';

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Push event - handle background notifications
self.addEventListener('push', (event) => {
    console.log('Push event received:', event);

    let notificationData = {
        title: 'Inventory Management',
        body: 'You have a new notification',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: NOTIFICATION_TAG,
        requireInteraction: false,
        silent: false,
        data: {
            url: '/notifications',
        },
    };

    // Parse push data if available
    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = {
                ...notificationData,
                title: pushData.title || notificationData.title,
                body:
                    pushData.message || pushData.body || notificationData.body,
                data: {
                    ...notificationData.data,
                    ...pushData.data,
                    notificationId: pushData.id,
                    type: pushData.type,
                },
            };
        } catch (error) {
            console.error('Error parsing push data:', error);
        }
    }

    const notificationPromise = self.registration.showNotification(
        notificationData.title,
        notificationData
    );

    event.waitUntil(notificationPromise);
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    console.log('Notification data:', event.notification.data);

    event.notification.close();

    // Get the URL from notification data, with better fallback logic
    let urlToOpen = '/notifications'; // Default fallback

    if (event.notification.data) {
        // Check for specific notification types and their URLs
        if (event.notification.data.type === 'request') {
            if (event.notification.data.requestId) {
                urlToOpen = `/requests/${event.notification.data.requestId}`;
            } else {
                urlToOpen = '/requests';
            }
        } else if (event.notification.data.type === 'inventory') {
            urlToOpen = '/inventory';
        } else if (event.notification.data.type === 'cart') {
            urlToOpen = '/cart';
        } else if (event.notification.data.url) {
            urlToOpen = event.notification.data.url;
        }
    }

    console.log('Opening URL:', urlToOpen);

    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                console.log('Found clients:', clientList.length);

                // Check if there's already a window/tab open
                for (const client of clientList) {
                    console.log('Checking client URL:', client.url);
                    if (
                        client.url.includes(self.location.origin) &&
                        'focus' in client
                    ) {
                        console.log('Focusing existing client');
                        // Navigate the existing client to the new URL
                        return client
                            .postMessage({
                                type: 'NAVIGATE',
                                url: urlToOpen,
                            })
                            .then(() => client.focus());
                    }
                }

                // If no existing window, open a new one
                console.log('Opening new window');
                if (clients.openWindow) {
                    return clients.openWindow(self.location.origin + urlToOpen);
                }
            })
            .catch((error) => {
                console.error('Error handling notification click:', error);
            })
    );
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);

    if (event.tag === 'notification-sync') {
        event.waitUntil(
            // Handle any pending notifications
            console.log('Syncing notifications...')
        );
    }
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});
