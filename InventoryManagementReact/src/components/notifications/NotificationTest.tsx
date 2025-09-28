import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Bell, TestTube } from 'lucide-react';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';

export function NotificationTest() {
    const { permission, isSupported, requestPermission, showNotification } =
        useNotificationPermission();

    const handleTestNotification = () => {
        showNotification('Test Notification', {
            body: 'This is a test notification to verify everything is working correctly!',
        });
    };

    const handleRequestPermission = async () => {
        await requestPermission();
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Notification Test
                </CardTitle>
                <CardDescription>
                    Test your browser notification setup
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium">Status:</p>
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="text-sm">
                            {!isSupported
                                ? 'Not supported'
                                : permission === 'granted'
                                  ? 'Enabled'
                                  : permission === 'denied'
                                    ? 'Blocked'
                                    : 'Not requested'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {permission !== 'granted' && isSupported && (
                        <Button onClick={handleRequestPermission} size="sm">
                            Enable Notifications
                        </Button>
                    )}
                    {permission === 'granted' && (
                        <Button onClick={handleTestNotification} size="sm">
                            Test Notification
                        </Button>
                    )}
                </div>

                {!isSupported && (
                    <p className="text-xs text-muted-foreground">
                        Your browser doesn't support notifications.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}





