# Notification System Documentation

## Overview

The notification system provides real-time notifications for the Inventory Management application. It includes both frontend (React) and backend (Spring Boot) components that work together to deliver notifications via WebSocket connections and REST APIs.

## Architecture

### Frontend (React)

- **NotificationContext**: Global state management for notifications
- **WebSocket Integration**: Real-time notifications using STOMP over WebSocket
- **Toast System**: In-app notification display
- **UI Components**: Comprehensive notification management interface

### Backend (Spring Boot)

- **NotificationService**: Core notification business logic
- **WebSocket Configuration**: STOMP messaging for real-time updates
- **REST API**: CRUD operations for notifications
- **Email Integration**: Email notifications for important events

## Features

### ✅ Completed Features

1. **Real-time Notifications**
    - WebSocket connection with STOMP protocol
    - Automatic reconnection on connection loss
    - User-specific notification channels

2. **Notification Types**
    - New Request notifications
    - Request Approved/Rejected/Fulfilled notifications
    - Low Stock alerts
    - General system notifications

3. **UI Components**
    - Notification bell with unread count
    - Comprehensive notification list with filtering
    - Notification preferences management
    - Test panel for development

4. **Toast System**
    - In-app toast notifications
    - Browser push notifications
    - Configurable notification types

5. **Error Handling**
    - Connection state management
    - Error boundaries for graceful failures
    - Retry mechanisms

## File Structure

```
src/
├── contexts/
│   └── NotificationContext.tsx          # Global notification state
├── hooks/
│   ├── useWebSocketNotification.ts      # WebSocket hook
│   ├── useToast.ts                      # Toast management
│   └── queries/
│       └── useNotification.ts           # API query hooks
├── components/
│   ├── notifications/
│   │   ├── NotificationBell.tsx         # Notification bell component
│   │   ├── NotificationList.tsx         # Notification list with filters
│   │   ├── NotificationItem.tsx         # Individual notification item
│   │   ├── GeneralNotificationForm.tsx  # Send notifications form
│   │   ├── NotificationPreferences.tsx  # User preferences
│   │   ├── NotificationTestPanel.tsx    # Testing interface
│   │   └── NotificationErrorBoundary.tsx # Error handling
│   └── ui/
│       ├── toast.tsx                    # Toast components
│       ├── toaster.tsx                  # Toast provider
│       └── tabs.tsx                     # Tab components
├── pages/
│   └── Notifications.tsx                # Main notifications page
├── api/
│   └── notification.ts                  # API client functions
├── lib/
│   └── stompClient.ts                   # STOMP WebSocket client
└── types/
    └── notification.ts                  # TypeScript definitions
```

## Usage

### Basic Usage

```tsx
import { useNotifications } from '@/contexts/NotificationContext';
import { useWebSocketNotification } from '@/hooks/useWebSocketNotification';

function MyComponent() {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const { connectionState } = useWebSocketNotification();

    return (
        <div>
            <p>Unread notifications: {unreadCount}</p>
            <p>
                Connection:{' '}
                {connectionState.connected ? 'Connected' : 'Disconnected'}
            </p>
        </div>
    );
}
```

### Sending Notifications

```tsx
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationType } from '@/types/notification';

function SendNotification() {
    const { addNotification } = useNotifications();

    const sendNotification = () => {
        addNotification({
            type: NotificationType.NEW_REQUEST,
            title: 'New Request',
            message: 'A new request has been submitted',
            isRead: false,
            requestId: 123,
        });
    };

    return <button onClick={sendNotification}>Send Notification</button>;
}
```

### Toast Notifications

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
    const { toast } = useToast();

    const showToast = () => {
        toast({
            title: 'Success',
            description: 'Operation completed successfully',
            variant: 'success',
            duration: 5000,
        });
    };

    return <button onClick={showToast}>Show Toast</button>;
}
```

## API Endpoints

### Backend Endpoints

| Method | Endpoint                                           | Description                    |
| ------ | -------------------------------------------------- | ------------------------------ |
| GET    | `/api/notifications`                               | Get all notifications for user |
| GET    | `/api/notifications/unread`                        | Get unread notifications       |
| GET    | `/api/notifications/count/unread`                  | Get unread count               |
| PUT    | `/api/notifications/{id}/mark-read`                | Mark notification as read      |
| PUT    | `/api/notifications/mark-all-read`                 | Mark all notifications as read |
| GET    | `/api/notifications/filter?type={type}`            | Get notifications by type      |
| DELETE | `/api/notifications/delete-all-old?daysOld={days}` | Delete old notifications       |
| POST   | `/api/general-notifications/send`                  | Send general notification      |
| GET    | `/api/general-notifications/available-users`       | Get available users            |

### WebSocket Endpoints

| Endpoint                             | Description                        |
| ------------------------------------ | ---------------------------------- |
| `/ws-notifications`                  | WebSocket connection endpoint      |
| `/topic/notifications/user-{userId}` | User-specific notification channel |

## Configuration

### Environment Variables

```env
VITE_WS_URL=ws://localhost:8080
VITE_API_URL=http://localhost:8080
```

### WebSocket Configuration

The WebSocket connection is configured in `src/lib/stompClient.ts`:

```typescript
const brokerURL = `${import.meta.env.VITE_WS_URL || 'http://localhost:8080'}/ws-notifications`;
```

## Testing

### Test Panel

The notification system includes a comprehensive test panel accessible at `/notifications` under the "Test" tab. This allows you to:

- Send quick test notifications for all types
- Create custom test notifications
- Test different notification scenarios

### Manual Testing

1. **Connection Testing**
    - Check connection status indicator
    - Test reconnection after network interruption

2. **Notification Flow**
    - Send test notifications
    - Verify real-time updates
    - Test mark as read functionality

3. **Error Handling**
    - Test with invalid data
    - Test network failures
    - Verify error boundaries

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
    - Check if backend is running
    - Verify WebSocket URL configuration
    - Check network connectivity

2. **Notifications Not Appearing**
    - Verify user authentication
    - Check notification permissions
    - Review browser console for errors

3. **Toast Notifications Not Showing**
    - Check if Toaster component is included in App
    - Verify toast hook usage
    - Check for JavaScript errors

### Debug Mode

Enable debug mode by setting the environment variable:

```env
VITE_DEBUG_NOTIFICATIONS=true
```

This will log detailed information about WebSocket connections and notification processing.

## Performance Considerations

1. **WebSocket Connections**
    - Automatic reconnection with exponential backoff
    - Connection pooling for multiple users
    - Graceful degradation when WebSocket unavailable

2. **Notification Storage**
    - Pagination for large notification lists
    - Automatic cleanup of old notifications
    - Efficient querying with proper indexing

3. **UI Performance**
    - Virtualized lists for large datasets
    - Debounced search and filtering
    - Optimistic updates for better UX

## Security

1. **Authentication**
    - JWT token-based WebSocket authentication
    - User-specific notification channels
    - Permission-based notification access

2. **Data Validation**
    - Input sanitization
    - Type checking with TypeScript
    - Backend validation for all requests

## Future Enhancements

1. **Push Notifications**
    - Service Worker integration
    - Mobile push notifications
    - Offline notification queuing

2. **Advanced Features**
    - Notification scheduling
    - Rich media notifications
    - Notification analytics

3. **Performance Improvements**
    - Notification batching
    - Advanced caching strategies
    - Real-time collaboration features

## Contributing

When contributing to the notification system:

1. Follow the existing code patterns
2. Add proper TypeScript types
3. Include error handling
4. Write tests for new features
5. Update documentation

## Support

For issues or questions about the notification system:

1. Check the troubleshooting section
2. Review the browser console for errors
3. Test with the provided test panel
4. Contact the development team
