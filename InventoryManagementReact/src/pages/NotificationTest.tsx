import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Bell,
    CheckCircle,
    XCircle,
    AlertCircle,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';

export default function NotificationTest() {
    const {
        permission,
        isSupported,
        isServiceWorkerReady,
        isPushSubscribed,
        isRequesting,
        error,
        requestPermission,
        testNotification,
        unsubscribeFromPush,
    } = useNotificationPermission();

    const getStatusIcon = () => {
        if (!isSupported) return <XCircle className="h-5 w-5 text-red-500" />;
        if (permission === 'granted' && isPushSubscribed)
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (permission === 'denied')
            return <XCircle className="h-5 w-5 text-red-500" />;
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    };

    const getStatusText = () => {
        if (!isSupported) return 'Not Supported';
        if (permission === 'granted' && isPushSubscribed)
            return 'Background Notifications Enabled';
        if (permission === 'denied') return 'Blocked';
        if (permission === 'default') return 'Not Requested';
        return 'Unknown';
    };

    const handleEnableNotifications = async () => {
        await requestPermission();
    };

    const handleDisableNotifications = async () => {
        await unsubscribeFromPush();
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">
                    Background Notification Test
                </h1>
                <p className="text-muted-foreground">
                    Test background notifications that work even when the
                    browser is closed
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Status
                        </CardTitle>
                        <CardDescription>
                            Current state of background notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                {getStatusIcon()}
                                <div>
                                    <p className="font-medium">
                                        Background Notifications
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {permission === 'granted' &&
                                        isPushSubscribed
                                            ? 'You will receive notifications even when the browser is closed'
                                            : 'Notifications will only work when the browser is open'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">{getStatusText()}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                {isServiceWorkerReady ? (
                                    <Wifi className="h-4 w-4 text-green-500" />
                                ) : (
                                    <WifiOff className="h-4 w-4 text-red-500" />
                                )}
                                <div>
                                    <p className="font-medium">
                                        Service Worker
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Required for background notifications
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    {isServiceWorkerReady
                                        ? 'Ready'
                                        : 'Not Ready'}
                                </p>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Test Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Test Notifications
                        </CardTitle>
                        <CardDescription>
                            Test your notification setup
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <Button
                                onClick={handleEnableNotifications}
                                disabled={
                                    !isSupported ||
                                    isRequesting ||
                                    (permission === 'granted' &&
                                        isPushSubscribed)
                                }
                                className="w-full"
                            >
                                {isRequesting
                                    ? 'Enabling...'
                                    : 'Enable Background Notifications'}
                            </Button>

                            <Button
                                onClick={handleDisableNotifications}
                                disabled={
                                    !isSupported ||
                                    isRequesting ||
                                    !isPushSubscribed
                                }
                                variant="outline"
                                className="w-full"
                            >
                                Disable Background Notifications
                            </Button>

                            <Button
                                onClick={testNotification}
                                disabled={!isSupported || isRequesting}
                                variant="secondary"
                                className="w-full"
                            >
                                Send Test Notification
                            </Button>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>
                                <strong>How to test:</strong>
                            </p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Enable background notifications</li>
                                <li>Send a test notification</li>
                                <li>Close the browser tab/window</li>
                                <li>
                                    Wait for a real notification from the system
                                </li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>About Background Notifications</CardTitle>
                    <CardDescription>
                        Understanding how background notifications work
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">How it works:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Service Worker runs in the background</li>
                                <li>
                                    • Receives push notifications from the
                                    server
                                </li>
                                <li>
                                    • Shows notifications even when browser is
                                    closed
                                </li>
                                <li>• Clicking notification opens the app</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Requirements:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                    • Modern browser with Service Worker support
                                </li>
                                <li>
                                    • HTTPS connection (required for push
                                    notifications)
                                </li>
                                <li>• User permission granted</li>
                                <li>• Server-side push notification setup</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
