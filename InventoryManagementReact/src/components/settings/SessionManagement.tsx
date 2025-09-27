import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Clock } from 'lucide-react';
import type { SecuritySettings } from '@/types/settings';

interface SessionManagementProps {
    settings: SecuritySettings;
    onUpdate: (settings: Partial<SecuritySettings>) => void;
    isLoading?: boolean;
}

const sessionTimeouts = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
];

export function SessionManagement({
    settings,
    onUpdate,
    isLoading,
}: SessionManagementProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Session Management
                </CardTitle>
                <CardDescription>
                    Control how long your sessions last and when you're notified
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout</Label>
                    <Select
                        value={settings.sessionTimeout.toString()}
                        onValueChange={(value) =>
                            onUpdate({
                                sessionTimeout: parseInt(value) as any,
                            })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                            {sessionTimeouts.map((timeout) => (
                                <SelectItem
                                    key={timeout.value}
                                    value={timeout.value.toString()}
                                >
                                    {timeout.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="loginNotifications">
                            Login Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Get notified when someone signs in to your account
                        </p>
                    </div>
                    <Switch
                        id="loginNotifications"
                        checked={settings.loginNotifications}
                        onCheckedChange={(checked) =>
                            onUpdate({ loginNotifications: checked })
                        }
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="trustedDevices">Trusted Devices</Label>
                        <p className="text-sm text-muted-foreground">
                            Remember this device for faster sign-ins
                        </p>
                    </div>
                    <Switch
                        id="trustedDevices"
                        checked={settings.trustedDevices}
                        onCheckedChange={(checked) =>
                            onUpdate({ trustedDevices: checked })
                        }
                        disabled={isLoading}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
