import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellOff, 
  CheckCircle2, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useUnreadNotifications, useUnreadCount, useMarkAsRead } from '@/hooks/queries/useNotification';
import { useWebSocketNotification } from '@/hooks/useWebSocketNotification';
import { NotificationItem } from './NotificationItem';
import { formatDistanceToNow } from 'date-fns';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { connectionState } = useWebSocketNotification();
  const { data: unreadNotifications = [], isLoading: isLoadingUnread } = useUnreadNotifications();
  const { data: unreadCount = 0, isLoading: isLoadingCount } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();

  // Show recent notifications (last 5)
  const recentNotifications = unreadNotifications.slice(0, 5);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      // Failed to mark notification as read
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    // Navigate to full notifications page
    window.location.href = '/notifications';
  };

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
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
            
            {/* Connection status indicator */}
            <div 
              className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
                connectionState.connected 
                  ? 'bg-green-500' 
                  : connectionState.connecting 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              title={
                connectionState.connected 
                  ? 'Connected' 
                  : connectionState.connecting 
                    ? 'Connecting...' 
                    : 'Disconnected'
              }
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="text-xs text-gray-500">
                    {unreadCount} unread
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewAll}
                  className="h-7 px-2 text-xs"
                >
                  View All
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="max-h-96">
            {isLoadingUnread ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                ))}
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <BellOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="p-3 hover:bg-gray-50 transition-colors">
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

          {recentNotifications.length > 0 && (
            <>
              <Separator />
              <div className="p-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewAll}
                  className="w-full h-8 text-xs"
                >
                  View All Notifications
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
