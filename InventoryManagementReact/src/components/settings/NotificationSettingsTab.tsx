import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Bell, Mail, Smartphone, Clock, Volume2 } from 'lucide-react';
import type { NotificationSettings } from '@/types/settings';
import { NotificationPermissionButton } from '@/components/notifications/NotificationPermissionButton';
import { NotificationTestPanel } from '@/components/notifications/NotificationTestPanel';
import { BackgroundNotificationSettings } from '@/components/notifications/NotificationSettings';

interface NotificationSettingsTabProps {
    settings: NotificationSettings;
    onUpdate: (settings: Partial<NotificationSettings>) => void;
    isLoading?: boolean;
}

export function NotificationSettingsTab({
    settings,
    onUpdate,
    isLoading,
}: NotificationSettingsTabProps) {
    const frequencies = [
        { value: 'immediate', label: 'Immediate' },
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'never', label: 'Never' },
    ];

    return (
        <div className="space-y-6">
            {/* Background Notifications */}
            <BackgroundNotificationSettings />

            {/* Notification Channels */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Channels
                    </CardTitle>
                    <CardDescription>
                        Choose how you want to receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <Label htmlFor="emailNotifications">
                                        Email Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via email
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="emailNotifications"
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked) =>
                                    onUpdate({ emailNotifications: checked })
                                }
                                disabled={isLoading}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <Label htmlFor="pushNotifications">
                                        Push Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive push notifications in your
                                        browser
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <NotificationPermissionButton />
                                <Switch
                                    id="pushNotifications"
                                    checked={settings.pushNotifications}
                                    onCheckedChange={(checked) =>
                                        onUpdate({ pushNotifications: checked })
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Volume2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <Label htmlFor="inAppNotifications">
                                        In-App Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Show notifications within the
                                        application
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="inAppNotifications"
                                checked={settings.inAppNotifications}
                                onCheckedChange={(checked) =>
                                    onUpdate({ inAppNotifications: checked })
                                }
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Types */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Types
                    </CardTitle>
                    <CardDescription>
                        Configure how often you want to receive different types
                        of notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="requestUpdates">
                                Request Updates
                            </Label>
                            <Select
                                value={settings.requestUpdates}
                                onValueChange={(value) =>
                                    onUpdate({ requestUpdates: value as any })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {frequencies.map((freq) => (
                                        <SelectItem
                                            key={freq.value}
                                            value={freq.value}
                                        >
                                            {freq.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="systemAlerts">System Alerts</Label>
                            <Select
                                value={settings.systemAlerts}
                                onValueChange={(value) =>
                                    onUpdate({ systemAlerts: value as any })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {frequencies.map((freq) => (
                                        <SelectItem
                                            key={freq.value}
                                            value={freq.value}
                                        >
                                            {freq.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reportReady">Report Ready</Label>
                            <Select
                                value={settings.reportReady}
                                onValueChange={(value) =>
                                    onUpdate({ reportReady: value as any })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {frequencies.map((freq) => (
                                        <SelectItem
                                            key={freq.value}
                                            value={freq.value}
                                        >
                                            {freq.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="weeklyDigest"
                                    checked={settings.weeklyDigest}
                                    onCheckedChange={(checked) =>
                                        onUpdate({ weeklyDigest: checked })
                                    }
                                    disabled={isLoading}
                                />
                                <Label
                                    htmlFor="weeklyDigest"
                                    className="text-sm"
                                >
                                    Receive weekly summary
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Quiet Hours
                    </CardTitle>
                    <CardDescription>
                        Set times when you don't want to receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="quietHoursEnabled">
                                Enable Quiet Hours
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Pause notifications during specified hours
                            </p>
                        </div>
                        <Switch
                            id="quietHoursEnabled"
                            checked={settings.quietHours.enabled}
                            onCheckedChange={(checked) =>
                                onUpdate({
                                    quietHours: {
                                        ...settings.quietHours,
                                        enabled: checked,
                                    },
                                })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    {settings.quietHours.enabled && (
                        <>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quietStart">
                                        Start Time
                                    </Label>
                                    <Input
                                        id="quietStart"
                                        type="time"
                                        value={settings.quietHours.start}
                                        onChange={(e) =>
                                            onUpdate({
                                                quietHours: {
                                                    ...settings.quietHours,
                                                    start: e.target.value,
                                                },
                                            })
                                        }
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quietEnd">End Time</Label>
                                    <Input
                                        id="quietEnd"
                                        type="time"
                                        value={settings.quietHours.end}
                                        onChange={(e) =>
                                            onUpdate({
                                                quietHours: {
                                                    ...settings.quietHours,
                                                    end: e.target.value,
                                                },
                                            })
                                        }
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Notification Testing */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Test Notifications
                    </CardTitle>
                    <CardDescription>
                        Test your notification settings to ensure they work
                        correctly
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <NotificationTestPanel />
                </CardContent>
            </Card>
        </div>
    );
}
