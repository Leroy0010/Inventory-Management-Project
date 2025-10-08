import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import type { WebSocketNotification } from '@/types/notification';
import SockJS from 'sockjs-client';

export interface StompClientConfig {
    brokerURL: string;
    connectHeaders?: Record<string, string>;
    debug?: (str: string) => void;
    onConnect?: (frame: any) => void;
    onStompError?: (frame: any) => void;
    onWebSocketError?: (error: any) => void;
    onDisconnect?: () => void;
}

export class StompNotificationClient {
    private client: Client | null = null;
    private subscriptions: Map<string, StompSubscription> = new Map();
    private pendingSubscriptions: {
        destination: string;
        handler: (message: IMessage) => void;
        id: string;
    }[] = [];
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;
    private config: StompClientConfig;

    constructor(config: StompClientConfig) {
        this.config = config;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                resolve();
                return;
            }

            this.client = new Client({
                webSocketFactory: () =>
                    new SockJS(
                        `${import.meta.env.VITE_WS_URL}`,
                        undefined,
                        { withCredentials: true } as any
                    ),
                debug: this.config.debug || (() => {}),
                onConnect: (frame) => {
                    // console.log("✅ STOMP Connected:", frame);
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    this.config.onConnect?.(frame);

                    // Flush any pending subscriptions
                    this.pendingSubscriptions.forEach((sub) => {
                        const s = this.client!.subscribe(
                            sub.destination,
                            sub.handler
                        );
                        this.subscriptions.set(sub.id, s);
                    });
                    this.pendingSubscriptions = [];

                    resolve();
                },
                onStompError: (frame) => {
                    console.error('❌ STOMP Error:', frame);
                    this.isConnected = false;
                    this.config.onStompError?.(frame);
                    reject(
                        new Error(
                            frame.headers.message || 'STOMP connection failed'
                        )
                    );
                },
                onWebSocketError: (error) => {
                    console.error('❌ WebSocket Error:', error);
                    this.isConnected = false;
                    this.config.onWebSocketError?.(error);
                    this.handleReconnect();
                },
                onDisconnect: () => {
                    // console.log("⚠️ STOMP Disconnected");
                    this.isConnected = false;
                    this.config.onDisconnect?.();
                },
            });

            this.client.activate();
        });
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            
            setTimeout(() => {
                this.connect().catch(() => {
                    // retry later
                });
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            // console.error("❌ Max reconnection attempts reached");
        }
    }

    subscribeToUserNotifications(
        userId: number,
        onNotification: (notification: WebSocketNotification) => void
    ): string {
        const destination = `/topic/notifications/user-${userId}`;
        const id = `user-${userId}`;

        // Check if already subscribed to this user
        if (this.subscriptions.has(id)) {
            console.log(
                '⚠️ Already subscribed to user notifications for user:',
                userId
            );
            return id;
        }

        const handler = (message: IMessage) => {
            try {
                const notification: WebSocketNotification = JSON.parse(
                    message.body
                );
                onNotification(notification);
            } catch (error) {
                console.error('Error parsing notification:', error);
            }
        };

        if (this.client && this.isConnected) {
            console.log('📡 Subscribing to user notifications:', destination);
            const s = this.client.subscribe(destination, handler);
            this.subscriptions.set(id, s);
        } else {
            console.log(
                '⏳ Connection not ready, queueing subscription:',
                destination
            );
            this.pendingSubscriptions.push({ destination, handler, id });
        }

        return id;
    }

    unsubscribe(subscriptionId: string): void {
        const subscription = this.subscriptions.get(subscriptionId);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionId);
        }
    }

    disconnect(): void {
        if (this.client) {
            this.subscriptions.forEach((s) => s.unsubscribe());
            this.subscriptions.clear();
            this.pendingSubscriptions = [];
            this.client.deactivate();
            this.client = null;
            this.isConnected = false;
        }
    }

    getConnectionState(): boolean {
        return this.isConnected;
    }
}

// Singleton instance
let stompClient: StompNotificationClient | null = null;
export function getStompClient(): StompNotificationClient {
    if (!stompClient) {
        stompClient = new StompNotificationClient({
            brokerURL: '', // not used with SockJS
            debug: (str) => {
                if (import.meta.env.DEV) {
                    console.log('STOMP Debug:', str);
                }
            },
        });
    }
    return stompClient;
}

export function destroyStompClient(): void {
    if (stompClient) {
        stompClient.disconnect();
        stompClient = null;
    }
}
