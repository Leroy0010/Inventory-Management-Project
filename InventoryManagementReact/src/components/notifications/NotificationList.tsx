import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Search,
    Filter,
    RefreshCw,
    CheckCircle2,
    Bell,
    BellOff,
    AlertCircle,
} from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import {
    useNotifications,
    useMarkAllAsRead,
} from '@/hooks/queries/useNotification';
import { useNotificationStore } from '@/stores/notificationStore';
import type { Notification, NotificationFilters } from '@/types/notification';
import { NotificationType } from '@/types/notification';

interface NotificationListProps {
    className?: string;
}

const NOTIFICATION_TYPES: { value: NotificationType | 'ALL'; label: string }[] =
    [
        { value: 'ALL', label: 'All Notifications' },
        { value: NotificationType.NEW_REQUEST, label: 'New Requests' },
        {
            value: NotificationType.REQUEST_APPROVED,
            label: 'Approved Requests',
        },
        {
            value: NotificationType.REQUEST_REJECTED,
            label: 'Rejected Requests',
        },
        {
            value: NotificationType.REQUEST_FULFILLED,
            label: 'Fulfilled Requests',
        },
        { value: NotificationType.LOW_STOCK, label: 'Low Stock Alerts' },
        { value: NotificationType.GENERAL, label: 'General Notifications' },
    ];

const READ_STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' },
];

export function NotificationList({ className = '' }: NotificationListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<NotificationType | 'ALL'>(
        'ALL'
    );
    const [readStatusFilter, setReadStatusFilter] = useState('all');

    const { filters, setFilters } = useNotificationStore();
    const markAllAsReadMutation = useMarkAllAsRead();

    // Build filters object
    const currentFilters: NotificationFilters = {
        ...filters,
        search: searchTerm || undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        read:
            readStatusFilter === 'all'
                ? undefined
                : readStatusFilter === 'unread'
                  ? false
                  : true,
    };

    const {
        data: notificationsData,
        isLoading,
        error,
        refetch,
    } = useNotifications(currentFilters);

    const notifications = useMemo(
        () => notificationsData?.notifications || [],
        [notificationsData]
    );
    const unreadCount = notifications.filter((n) => !n.read).length;

    // Filter notifications locally for search
    const filteredNotifications = useMemo(() => {
        if (!searchTerm) return notifications;

        return notifications.filter(
            (notification) =>
                notification.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                notification.message
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    }, [notifications, searchTerm]);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsReadMutation.mutateAsync();
        } catch (error) {
            // Failed to mark all notifications as read
        }
    };

    const handleRefresh = () => {
        refetch();
    };

    const handleFilterChange = (newFilters: Partial<NotificationFilters>) => {
        setFilters(newFilters);
    };

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="p-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Failed to load notifications. Please try again.
                        </AlertDescription>
                    </Alert>
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="mt-4"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={className}>
            {/* Header */}
            <Card className="mb-4">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            <CardTitle className="text-lg">
                                Notifications
                            </CardTitle>
                            {unreadCount > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                    {unreadCount} unread
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isLoading}
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                                />
                            </Button>

                            {unreadCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    disabled={markAllAsReadMutation.isPending}
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Mark All Read
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {/* Filters */}
                <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div className="w-full sm:w-48">
                            <Select
                                value={typeFilter}
                                onValueChange={(value) =>
                                    setTypeFilter(
                                        value as NotificationType | 'ALL'
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {NOTIFICATION_TYPES.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Read Status Filter */}
                        <div className="w-full sm:w-32">
                            <Select
                                value={readStatusFilter}
                                onValueChange={setReadStatusFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {READ_STATUS_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            ))}
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <BellOff className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ||
                                typeFilter !== 'ALL' ||
                                readStatusFilter !== 'all'
                                    ? 'No notifications match your filters'
                                    : 'No notifications yet'}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm ||
                                typeFilter !== 'ALL' ||
                                readStatusFilter !== 'all'
                                    ? 'Try adjusting your filters to see more notifications.'
                                    : "You'll see notifications here when they arrive."}
                            </p>
                            {(searchTerm ||
                                typeFilter !== 'ALL' ||
                                readStatusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setTypeFilter('ALL');
                                        setReadStatusFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    className="hover:bg-gray-50 transition-colors"
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
