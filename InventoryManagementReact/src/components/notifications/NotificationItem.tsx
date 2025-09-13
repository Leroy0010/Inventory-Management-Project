import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Clock, 
  CheckCircle2,
  XCircle,
  Package,
  AlertTriangle,
  Bell,
  FileText
} from 'lucide-react';
import { useMarkAsRead } from '@/hooks/queries/useNotification';
import { useNavigate } from 'react-router-dom';
import type { Notification, NotificationType } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
  onNavigate?: (notification: Notification) => void;
  showActions?: boolean;
  className?: string;
}

// Icon mapping for notification types
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'NEW_REQUEST':
      return <FileText className="h-4 w-4" />;
    case 'REQUEST_APPROVED':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'REQUEST_REJECTED':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'REQUEST_FULFILLED':
      return <Package className="h-4 w-4 text-blue-500" />;
    case 'LOW_STOCK':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'GENERAL':
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

// Color mapping for notification types
const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'NEW_REQUEST':
      return 'bg-blue-50 border-blue-200';
    case 'REQUEST_APPROVED':
      return 'bg-green-50 border-green-200';
    case 'REQUEST_REJECTED':
      return 'bg-red-50 border-red-200';
    case 'REQUEST_FULFILLED':
      return 'bg-purple-50 border-purple-200';
    case 'LOW_STOCK':
      return 'bg-orange-50 border-orange-200';
    case 'GENERAL':
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

// Check if notification has actionable content
const hasActionableContent = (notification: Notification): boolean => {
  return (
    (!!notification.requestId && isRequestRelated(notification.type)) ||
    (!!notification.itemId && isItemRelated(notification.type))
  );
};

// Check if notification type is request-related
const isRequestRelated = (type: NotificationType): boolean => {
  return ['NEW_REQUEST', 'REQUEST_APPROVED', 'REQUEST_REJECTED', 'REQUEST_FULFILLED'].includes(type);
};

// Check if notification type is item-related
const isItemRelated = (type: NotificationType): boolean => {
  return ['LOW_STOCK'].includes(type);
};

export function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onNavigate,
  showActions = true,
  className = '' 
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const markAsReadMutation = useMarkAsRead();
  const navigate = useNavigate();

  const handleMarkAsRead = async () => {
    if (!notification.isRead) {
      try {
        await markAsReadMutation.mutateAsync(notification.id);
        onMarkAsRead?.(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleViewDetails = () => {
    // Mark as read first
    if (!notification.isRead) {
      handleMarkAsRead();
    }

    // Navigate based on notification type
    if (notification.requestId && isRequestRelated(notification.type)) {
      navigate(`/requests/${notification.requestId}`);
    } else if (notification.itemId && isItemRelated(notification.type)) {
      navigate(`/inventory/${notification.itemId}`);
    } else {
      onNavigate?.(notification);
    }
  };

  const canNavigate = hasActionableContent(notification);

  return (
    <Card 
      className={`
        transition-all duration-200 cursor-pointer
        ${notification.isRead ? 'opacity-75' : 'opacity-100'}
        ${isHovered ? 'shadow-md scale-[1.02]' : 'shadow-sm'}
        ${getNotificationColor(notification.type)}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={canNavigate ? handleViewDetails : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className={`font-medium text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {notification.message}
                </p>
              </div>

              {/* Unread indicator */}
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>

              {/* Type badge */}
              <Badge 
                variant="secondary" 
                className="text-xs"
              >
                {notification.type.replace('_', ' ').toLowerCase()}
              </Badge>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                {!notification.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead();
                    }}
                    disabled={markAsReadMutation.isPending}
                    className="text-xs h-7"
                  >
                    <EyeOff className="h-3 w-3 mr-1" />
                    Mark Read
                  </Button>
                )}

                {canNavigate && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails();
                    }}
                    className="text-xs h-7"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}