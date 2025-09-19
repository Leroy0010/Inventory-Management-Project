import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Bell,
    BellOff,
    Settings,
    Send,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import { NotificationList } from '@/components/notifications/NotificationList';
import { GeneralNotificationForm } from '@/components/notifications/GeneralNotificationForm';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { useUnreadCount } from '@/hooks/queries/useNotification';
import { useWebSocketNotification } from '@/hooks/useWebSocketNotification';

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const { data: unreadCount = 0, isLoading: isLoadingCount } =
        useUnreadCount();
    const { connectionState } = useWebSocketNotification();

    const handleRefresh = () => {
        // This will trigger a refetch of all notification queries
        window.location.reload();
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bell className="h-8 w-8" />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-gray-600">
                            {isLoadingCount
                                ? 'Loading...'
                                : `${unreadCount} unread notifications`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Connection Status */}
                    <div className="flex items-center gap-2 text-sm">
                        <div
                            className={`w-2 h-2 rounded-full ${
                                connectionState.connected
                                    ? 'bg-green-500'
                                    : connectionState.connecting
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                            }`}
                        />
                        <span className="text-gray-600">
                            {connectionState.connected
                                ? 'Connected'
                                : connectionState.connecting
                                  ? 'Connecting...'
                                  : 'Disconnected'}
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoadingCount}
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${isLoadingCount ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Connection Error Alert */}
            {connectionState.error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">
                                Connection Error
                            </span>
                        </div>
                        <p className="text-red-700 mt-1">
                            {connectionState.error}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Main Content */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                        value="all"
                        className="flex items-center gap-2"
                    >
                        <Bell className="h-4 w-4" />
                        All Notifications
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="send"
                        className="flex items-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                        Send Notification
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="flex items-center gap-2"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <NotificationList />
                </TabsContent>

                <TabsContent value="send" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                Send General Notification
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GeneralNotificationForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <NotificationPreferences />
                </TabsContent>
            </Tabs>
        </div>
    );
}
