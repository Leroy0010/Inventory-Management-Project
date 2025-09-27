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
import { Button } from '@/components/ui/button';
import { CheckCircle, Key } from 'lucide-react';
import type { SecuritySettings } from '@/types/settings';

interface TwoFactorAuthenticationProps {
    settings: SecuritySettings;
    onUpdate: (settings: Partial<SecuritySettings>) => void;
    isLoading?: boolean;
}

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
    {
        value: 'sms',
        label: 'SMS (Coming Soon)',
        description: 'Receive codes via SMS - Not available yet',
        disabled: true,
    },
    {
        value: 'app',
        label: 'Authenticator App (Coming Soon)',
        description: 'Use authenticator app - Not available yet',
        disabled: true,
    },
];

export function TwoFactorAuthentication({
    settings,
    onUpdate,
    isLoading,
}: TwoFactorAuthenticationProps) {
    return (
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
                            Require a second verification step when signing in
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
                            <Label htmlFor="twoFactorMethod">2FA Method</Label>
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
                                            disabled={method.disabled}
                                        >
                                            <div>
                                                <div
                                                    className={`font-medium ${method.disabled ? 'text-muted-foreground' : ''}`}
                                                >
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
    );
}
