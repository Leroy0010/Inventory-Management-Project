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
import { Eye, Users, Shield, Mail, Activity } from 'lucide-react';
import type { PrivacySettings } from '@/types/settings';

interface PrivacySettingsTabProps {
    settings: PrivacySettings;
    onUpdate: (settings: Partial<PrivacySettings>) => void;
    isLoading?: boolean;
}

export function PrivacySettingsTab({
    settings,
    onUpdate,
    isLoading,
}: PrivacySettingsTabProps) {
    const privacyLevels = [
        {
            value: 'public',
            label: 'Public',
            description: 'Visible to everyone',
        },
        {
            value: 'department',
            label: 'Department',
            description: 'Visible to your department only',
        },
        {
            value: 'private',
            label: 'Private',
            description: 'Visible to you only',
        },
    ];

    const dataSharingLevels = [
        { value: 'none', label: 'None', description: 'No data sharing' },
        {
            value: 'analytics',
            label: 'Analytics Only',
            description: 'Share usage analytics only',
        },
        {
            value: 'full',
            label: 'Full',
            description: 'Share all data for improvement',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Profile Visibility */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Profile Visibility
                    </CardTitle>
                    <CardDescription>
                        Control who can see your profile information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="profileVisibility">
                            Profile Visibility
                        </Label>
                        <Select
                            value={settings.profileVisibility}
                            onValueChange={(value) =>
                                onUpdate({ profileVisibility: value as any })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select visibility level" />
                            </SelectTrigger>
                            <SelectContent>
                                {privacyLevels.map((level) => (
                                    <SelectItem
                                        key={level.value}
                                        value={level.value}
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {level.label}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {level.description}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="showOnlineStatus">
                                Show Online Status
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Let others see when you're online
                            </p>
                        </div>
                        <Switch
                            id="showOnlineStatus"
                            checked={settings.showOnlineStatus}
                            onCheckedChange={(checked) =>
                                onUpdate({ showOnlineStatus: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="allowDirectMessages">
                                Allow Direct Messages
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Allow other users to send you direct messages
                            </p>
                        </div>
                        <Switch
                            id="allowDirectMessages"
                            checked={settings.allowDirectMessages}
                            onCheckedChange={(checked) =>
                                onUpdate({ allowDirectMessages: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Data Collection
                    </CardTitle>
                    <CardDescription>
                        Control what data is collected and how it's used
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="dataSharing">Data Sharing Level</Label>
                        <Select
                            value={settings.dataSharing}
                            onValueChange={(value) =>
                                onUpdate({ dataSharing: value as any })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select data sharing level" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataSharingLevels.map((level) => (
                                    <SelectItem
                                        key={level.value}
                                        value={level.value}
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {level.label}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {level.description}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="activityTracking">
                                Activity Tracking
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Track your activity to improve the application
                            </p>
                        </div>
                        <Switch
                            id="activityTracking"
                            checked={settings.activityTracking}
                            onCheckedChange={(checked) =>
                                onUpdate({ activityTracking: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="analyticsOptIn">
                                Analytics Opt-in
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Help us improve by sharing anonymous usage data
                            </p>
                        </div>
                        <Switch
                            id="analyticsOptIn"
                            checked={settings.analyticsOptIn}
                            onCheckedChange={(checked) =>
                                onUpdate({ analyticsOptIn: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Communication Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Communication Preferences
                    </CardTitle>
                    <CardDescription>
                        Control how you receive communications from us
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="marketingEmails">
                                Marketing Emails
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive promotional emails and updates
                            </p>
                        </div>
                        <Switch
                            id="marketingEmails"
                            checked={settings.marketingEmails}
                            onCheckedChange={(checked) =>
                                onUpdate({ marketingEmails: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Data Rights */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Your Data Rights
                    </CardTitle>
                    <CardDescription>
                        Information about your data and privacy rights
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 bg-muted/50">
                        <h4 className="font-medium mb-2">Data Export</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            You can request a copy of all your personal data at
                            any time.
                        </p>
                        <button className="text-sm text-primary hover:underline">
                            Request Data Export
                        </button>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/50">
                        <h4 className="font-medium mb-2">Data Deletion</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            You can request the deletion of your personal data.
                        </p>
                        <button className="text-sm text-destructive hover:underline">
                            Request Data Deletion
                        </button>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/50">
                        <h4 className="font-medium mb-2">Privacy Policy</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Read our full privacy policy to understand how we
                            handle your data.
                        </p>
                        <button className="text-sm text-primary hover:underline">
                            View Privacy Policy
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
