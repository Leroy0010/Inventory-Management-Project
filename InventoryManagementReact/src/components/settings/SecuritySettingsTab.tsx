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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    Key,
    Clock,
    Smartphone,
    Mail,
    AlertTriangle,
    CheckCircle,
    Settings as SettingsIcon,
} from 'lucide-react';
import type { SecuritySettings } from '@/types/settings';

interface SecuritySettingsTabProps {
    settings: SecuritySettings;
    onUpdate: (settings: Partial<SecuritySettings>) => void;
    isLoading?: boolean;
}

export function SecuritySettingsTab({
    settings,
    onUpdate,
    isLoading,
}: SecuritySettingsTabProps) {
    const twoFactorMethods = [
        {
            value: 'none',
            label: 'Disabled',
            description: 'No two-factor authentication',
        },
        {
            value: 'email',
            label: 'Email',
            description: 'Receive codes via email',
        },
        { value: 'sms', label: 'SMS', description: 'Receive codes via SMS' },
        {
            value: 'app',
            label: 'Authenticator App',
            description: 'Use authenticator app',
        },
    ];

    const sessionTimeouts = [
        { value: 15, label: '15 minutes' },
        { value: 30, label: '30 minutes' },
        { value: 60, label: '1 hour' },
        { value: 120, label: '2 hours' },
        { value: 240, label: '4 hours' },
    ];

    const passwordExpiryOptions = [
        { value: 30, label: '30 days' },
        { value: 60, label: '60 days' },
        { value: 90, label: '90 days' },
        { value: 180, label: '6 months' },
        { value: 365, label: '1 year' },
        { value: 0, label: 'Never expire' },
    ];

    return (
        <div className="space-y-6">
            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="twoFactorEnabled">Enable 2FA</Label>
                            <p className="text-sm text-muted-foreground">
                                Require a second verification step when signing
                                in
                            </p>
                        </div>
                        <Switch
                            id="twoFactorEnabled"
                            checked={settings.twoFactorEnabled}
                            onCheckedChange={(checked) =>
                                onUpdate({ twoFactorEnabled: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    {settings.twoFactorEnabled && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="twoFactorMethod">
                                    2FA Method
                                </Label>
                                <Select
                                    value={settings.twoFactorMethod}
                                    onValueChange={(value) =>
                                        onUpdate({
                                            twoFactorMethod: value as any,
                                        })
                                    }
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select 2FA method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {twoFactorMethods.map((method) => (
                                            <SelectItem
                                                key={method.value}
                                                value={method.value}
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {method.label}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {method.description}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {settings.twoFactorMethod !== 'none' && (
                                <div className="rounded-lg border p-4 bg-muted/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="font-medium">
                                            2FA Active
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Two-factor authentication is currently
                                        enabled using{' '}
                                        {twoFactorMethods
                                            .find(
                                                (m) =>
                                                    m.value ===
                                                    settings.twoFactorMethod
                                            )
                                            ?.label.toLowerCase()}
                                        .
                                    </p>
                                    <Button variant="outline" size="sm">
                                        Manage 2FA Settings
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Session Management
                    </CardTitle>
                    <CardDescription>
                        Control how long your sessions last and when you're
                        notified
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
                                Get notified when someone signs in to your
                                account
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
                            <Label htmlFor="trustedDevices">
                                Trusted Devices
                            </Label>
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

            {/* Password Policy */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Password Policy
                    </CardTitle>
                    <CardDescription>
                        Configure password requirements and expiration
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="passwordExpiry">Password Expiry</Label>
                        <Select
                            value={settings.passwordExpiry.toString()}
                            onValueChange={(value) =>
                                onUpdate({ passwordExpiry: parseInt(value) })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select expiry period" />
                            </SelectTrigger>
                            <SelectContent>
                                {passwordExpiryOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value.toString()}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="requirePasswordChange">
                                Require Password Change
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Force password change on next login
                            </p>
                        </div>
                        <Switch
                            id="requirePasswordChange"
                            checked={settings.requirePasswordChange}
                            onCheckedChange={(checked) =>
                                onUpdate({ requirePasswordChange: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* API Access */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" />
                        API Access
                    </CardTitle>
                    <CardDescription>
                        Manage API access and integration settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="apiAccess">API Access</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow third-party applications to access your
                                data
                            </p>
                        </div>
                        <Switch
                            id="apiAccess"
                            checked={settings.apiAccess}
                            onCheckedChange={(checked) =>
                                onUpdate({ apiAccess: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    {settings.apiAccess && (
                        <>
                            <Separator />
                            <div className="rounded-lg border p-4 bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">API Key</span>
                                    <Badge variant="outline">Active</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Your API key is currently active and can be
                                    used by authorized applications.
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        View API Key
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Regenerate
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Security Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Security Actions
                    </CardTitle>
                    <CardDescription>
                        Take immediate security actions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-start">
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Smartphone className="h-4 w-4 mr-2" />
                            Manage Devices
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Mail className="h-4 w-4 mr-2" />
                            View Login History
                        </Button>
                        <Button variant="destructive" className="justify-start">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Sign Out All Devices
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
