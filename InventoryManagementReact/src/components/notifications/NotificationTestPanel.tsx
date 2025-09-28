import React from 'react';
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
import { toast } from '@/hooks/useToast';

export function NotificationTestPanel() {
    const { permission, isSupported, testNotification, showNotification } =
        useNotificationPermission();

    const testToastNotification = () => {
        toast({
            title: 'Test Toast',
            description: 'This is a test toast notification.',
            variant: 'default',
        });
    };

    const testBrowserNotification = () => {
        if (permission === 'granted') {
            showNotification('Test Browser Notification', {
                body: 'This is a test browser notification to verify it works correctly.',
            });
        } else {
            toast({
                title: 'Permission Required',
                description: 'Please enable browser notifications first.',
                variant: 'destructive',
            });
        }
    };

    const testSystemNotification = () => {
        testNotification();
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Notification Test Panel
                </CardTitle>
                <CardDescription>
                    Test different types of notifications to verify they work
                    correctly.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2">
                    <Button
                        onClick={testToastNotification}
                        variant="outline"
                        className="w-full"
                    >
                        Test Toast Notification
                    </Button>

                    <Button
                        onClick={testBrowserNotification}
                        variant="outline"
                        className="w-full"
                    >
                        <Bell className="h-4 w-4 mr-2" />
                        Test Browser Notification
                    </Button>

                    <Button
                        onClick={testSystemNotification}
                        variant="outline"
                        className="w-full"
                    >
                        Test System Notification
                    </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                    <p>Permission Status: {permission}</p>
                    <p>Browser Support: {isSupported ? 'Yes' : 'No'}</p>
                </div>
            </CardContent>
        </Card>
    );
}
