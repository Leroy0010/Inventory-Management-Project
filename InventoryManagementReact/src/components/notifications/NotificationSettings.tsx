import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Bell,
    BellOff,
    Wifi,
    WifiOff,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';

export function BackgroundNotificationSettings() {
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

    const handleToggleNotifications = async () => {
        if (permission === 'granted') {
            await unsubscribeFromPush();
        } else {
            await requestPermission();
        }
    };

    const getStatusIcon = () => {
        if (!isSupported) return <XCircle className="h-4 w-4 text-red-500" />;
        if (permission === 'granted' && isPushSubscribed)
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        if (permission === 'denied')
            return <XCircle className="h-4 w-4 text-red-500" />;
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    };

    const getStatusText = () => {
        if (!isSupported) return 'Not Supported';
        if (permission === 'granted' && isPushSubscribed) return 'Enabled';
        if (permission === 'denied') return 'Blocked';
        if (permission === 'default') return 'Not Requested';
        return 'Unknown';
    };

    const getStatusColor = () => {
        if (!isSupported) return 'destructive';
        if (permission === 'granted' && isPushSubscribed) return 'default';
        if (permission === 'denied') return 'destructive';
        return 'secondary';
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                </CardTitle>
                <CardDescription>
                    Manage your notification preferences for the inventory
                    management system.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Status Overview */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        {getStatusIcon()}
                        <div>
                            <p className="font-medium">
                                Background Notifications
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications even when the app is
                                closed
                            </p>
                        </div>
                    </div>
                    <Badge variant={getStatusColor() as any}>
                        {getStatusText()}
                    </Badge>
                </div>

                {/* Service Worker Status */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        {isServiceWorkerReady ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                            <p className="font-medium">Service Worker</p>
                            <p className="text-sm text-muted-foreground">
                                Required for background notifications
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant={
                            isServiceWorkerReady ? 'default' : 'destructive'
                        }
                    >
                        {isServiceWorkerReady ? 'Ready' : 'Not Ready'}
                    </Badge>
                </div>

                {/* Error Display */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Controls */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="font-medium">Enable Notifications</p>
                            <p className="text-sm text-muted-foreground">
                                Allow the app to send you notifications
                            </p>
                        </div>
                        <Switch
                            checked={
                                permission === 'granted' && isPushSubscribed
                            }
                            onCheckedChange={handleToggleNotifications}
                            disabled={!isSupported || isRequesting}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={testNotification}
                            disabled={!isSupported || isRequesting}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Bell className="h-4 w-4" />
                            Test Notification
                        </Button>

                        {permission === 'denied' && (
                            <Button
                                onClick={() =>
                                    window.open(
                                        'chrome://settings/content/notifications',
                                        '_blank'
                                    )
                                }
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <BellOff className="h-4 w-4" />
                                Open Browser Settings
                            </Button>
                        )}
                    </div>
                </div>

                {/* Information */}
                <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                        <strong>Background Notifications:</strong> You'll
                        receive notifications even when the browser is closed.
                    </p>
                    <p>
                        <strong>Browser Support:</strong> Requires a modern
                        browser with Service Worker and Push API support.
                    </p>
                    <p>
                        <strong>Privacy:</strong> Notifications are only sent
                        for inventory-related events and can be disabled
                        anytime.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
