import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Bell,
    Mail,
    Smartphone,
    Settings,
    Save,
    RefreshCw,
} from 'lucide-react';
import { NotificationType } from '@/types/notification';
import { useToast } from '@/hooks/useToast';

interface NotificationPreferencesProps {
    className?: string;
}

const NOTIFICATION_TYPES = [
    {
        type: NotificationType.NEW_REQUEST,
        label: 'New Requests',
        description: 'When new requests are submitted',
    },
    {
        type: NotificationType.REQUEST_APPROVED,
        label: 'Request Approved',
        description: 'When your requests are approved',
    },
    {
        type: NotificationType.REQUEST_REJECTED,
        label: 'Request Rejected',
        description: 'When your requests are rejected',
    },
    {
        type: NotificationType.REQUEST_FULFILLED,
        label: 'Request Fulfilled',
        description: 'When your requests are fulfilled',
    },
    {
        type: NotificationType.LOW_STOCK,
        label: 'Low Stock Alerts',
        description: 'When inventory items are running low',
    },
    {
        type: NotificationType.GENERAL,
        label: 'General Notifications',
        description: 'System announcements and updates',
    },
];

export function NotificationPreferences({
    className = '',
}: NotificationPreferencesProps) {
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: true,
        browserNotifications: true,
        types: {
            [NotificationType.NEW_REQUEST]: true,
            [NotificationType.REQUEST_APPROVED]: true,
            [NotificationType.REQUEST_REJECTED]: true,
            [NotificationType.REQUEST_FULFILLED]: true,
            [NotificationType.LOW_STOCK]: true,
            [NotificationType.GENERAL]: true,
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement API call to save preferences
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

            toast({
                title: 'Preferences Saved',
                description:
                    'Your notification preferences have been updated successfully.',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save preferences. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setPreferences({
            emailNotifications: true,
            pushNotifications: true,
            browserNotifications: true,
            types: {
                [NotificationType.NEW_REQUEST]: true,
                [NotificationType.REQUEST_APPROVED]: true,
                [NotificationType.REQUEST_REJECTED]: true,
                [NotificationType.REQUEST_FULFILLED]: true,
                [NotificationType.LOW_STOCK]: true,
                [NotificationType.GENERAL]: true,
            },
        });
    };

    const handleTypeToggle = (type: NotificationType) => {
        setPreferences((prev) => ({
            ...prev,
            types: {
                ...prev.types,
                [type]: !prev.types[type],
            },
        }));
    };

    const enabledTypesCount = Object.values(preferences.types).filter(
        Boolean
    ).length;

    return (
        <div className={className}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Notification Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Global Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Global Settings</h3>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <Label htmlFor="email-notifications">
                                        Email Notifications
                                    </Label>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Receive notifications via email
                                </p>
                            </div>
                            <Switch
                                id="email-notifications"
                                checked={preferences.emailNotifications}
                                onCheckedChange={(checked) =>
                                    setPreferences((prev) => ({
                                        ...prev,
                                        emailNotifications: checked,
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="h-4 w-4" />
                                    <Label htmlFor="push-notifications">
                                        Push Notifications
                                    </Label>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Receive push notifications on mobile devices
                                </p>
                            </div>
                            <Switch
                                id="push-notifications"
                                checked={preferences.pushNotifications}
                                onCheckedChange={(checked) =>
                                    setPreferences((prev) => ({
                                        ...prev,
                                        pushNotifications: checked,
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4" />
                                    <Label htmlFor="browser-notifications">
                                        Browser Notifications
                                    </Label>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Show browser notifications when tab is not
                                    active
                                </p>
                            </div>
                            <Switch
                                id="browser-notifications"
                                checked={preferences.browserNotifications}
                                onCheckedChange={(checked) =>
                                    setPreferences((prev) => ({
                                        ...prev,
                                        browserNotifications: checked,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Notification Types */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                                Notification Types
                            </h3>
                            <Badge variant="secondary">
                                {enabledTypesCount} of{' '}
                                {NOTIFICATION_TYPES.length} enabled
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {NOTIFICATION_TYPES.map(
                                ({ type, label, description }) => (
                                    <div
                                        key={type}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor={`type-${type}`}
                                                className="font-medium"
                                            >
                                                {label}
                                            </Label>
                                            <p className="text-sm text-gray-600">
                                                {description}
                                            </p>
                                        </div>
                                        <Switch
                                            id={`type-${type}`}
                                            checked={preferences.types[type]}
                                            onCheckedChange={() =>
                                                handleTypeToggle(type)
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Preferences'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
