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
import { Shield } from 'lucide-react';
import type { SecuritySettings } from '@/types/settings';

interface PasswordPolicyProps {
    settings: SecuritySettings;
    onUpdate: (settings: Partial<SecuritySettings>) => void;
    isLoading?: boolean;
}

const passwordExpiryOptions = [
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' },
    { value: 180, label: '6 months' },
    { value: 365, label: '1 year' },
    { value: 0, label: 'Never expire' },
];

export function PasswordPolicy({
    settings,
    onUpdate,
    isLoading,
}: PasswordPolicyProps) {
    return (
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
    );
}
