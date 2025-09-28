import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, BellOff, ExternalLink, Loader2 } from 'lucide-react';
import {
    useUnreadNotifications,
    useUnreadCount,
    useMarkAsRead,
} from '@/hooks/queries/useNotification';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationItem } from './NotificationItem';

interface NotificationBellProps {
    className?: string;
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [animatePulse, setAnimatePulse] = useState(false);
    const [animateShake, setAnimateShake] = useState(false);
    // Get data from context and queries
    const { isConnected, unreadCount: contextUnreadCount } = useNotifications();
    const { data: unreadNotifications = [], isLoading: isLoadingUnread } =
        useUnreadNotifications();
    const { data: unreadCount = 0, isLoading: isLoadingCount } =
        useUnreadCount();
    const markAsReadMutation = useMarkAsRead();
    const { testNotification } = useNotificationPermission();
    const prevCountRef = useRef(unreadCount);

    // Trigger animations on new notifications
    useEffect(() => {
        if (unreadCount > prevCountRef.current) {
            const newCount = unreadCount - prevCountRef.current;

            // Always pulse
            setAnimatePulse(true);
            const pulseTimeout = setTimeout(() => setAnimatePulse(false), 800);

            // Shake if multiple notifications
            if (newCount > 1) {
                setAnimateShake(true);
                const shakeTimeout = setTimeout(
                    () => setAnimateShake(false),
                    600
                );
                return () => clearTimeout(shakeTimeout);
            }

            return () => clearTimeout(pulseTimeout);
        }
        prevCountRef.current = unreadCount;
    }, [unreadCount]);

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await markAsReadMutation.mutateAsync(notificationId);
        } catch {
            //
        }
    };

    const handleViewAll = () => {
        setIsOpen(false);
        window.location.href = '/notifications';
    };

    const recentNotifications = unreadNotifications.slice(0, 5);

    return (
        <div className={className}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9"
                        disabled={isLoadingCount}
                    >
                        {isLoadingCount ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Bell className="h-4 w-4" />
                        )}

                        {/* Unread count badge */}
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs
                  ${animatePulse ? 'animate-ping' : ''} ${animateShake ? 'animate-shake' : ''}`}
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}

                        {/* Connection status indicator - managed by context */}
                        <div
                            className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
                                isConnected ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            title={isConnected ? 'Connected' : 'Disconnected'}
                        />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs text-gray-500">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>

                    <ScrollArea className="max-h-96 overflow-y-auto no-scrollbar">
                        {isLoadingUnread ? (
                            <div className="p-4 space-y-3 animate-pulse">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded" />
                                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : recentNotifications.length === 0 ? (
                            <div className="p-6 text-center">
                                <BellOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                    No new notifications
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {recentNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <NotificationItem
                                            notification={notification}
                                            onMarkAsRead={handleMarkAsRead}
                                            showActions={false}
                                            className="border-0 shadow-none bg-transparent p-0"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <Separator />
                    <div className="p-3 space-y-2">
                        {recentNotifications.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleViewAll}
                                className="w-full h-8 text-xs"
                            >
                                View All Notifications
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={testNotification}
                            className="w-full h-8 text-xs"
                        >
                            Test Notification
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
