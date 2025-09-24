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
import { Palette, Globe, Clock, Calendar, Save } from 'lucide-react';
import type { GeneralSettings } from '@/types/settings';

interface GeneralSettingsTabProps {
    settings: GeneralSettings;
    onUpdate: (settings: Partial<GeneralSettings>) => void;
    isLoading?: boolean;
}

export function GeneralSettingsTab({
    settings,
    onUpdate,
    isLoading,
}: GeneralSettingsTabProps) {
    const timezones = [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Australia/Sydney',
    ];

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'fr', label: 'Français' },
        { value: 'de', label: 'Deutsch' },
    ];

    return (
        <div className="space-y-6">
            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Appearance
                    </CardTitle>
                    <CardDescription>
                        Customize the look and feel of your interface
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select
                                value={settings.theme}
                                onValueChange={(value) =>
                                    onUpdate({ theme: value as any })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">
                                        System
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select
                                value={settings.language}
                                onValueChange={(value) =>
                                    onUpdate({ language: value as any })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem
                                            key={lang.value}
                                            value={lang.value}
                                        >
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Localization */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Localization
                    </CardTitle>
                    <CardDescription>
                        Set your timezone and date/time preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select
                                value={settings.timezone}
                                onValueChange={(value) =>
                                    onUpdate({ timezone: value })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timezones.map((tz) => (
                                        <SelectItem key={tz} value={tz}>
                                            {tz.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateFormat">Date Format</Label>
                            <Select
                                value={settings.dateFormat}
                                onValueChange={(value) =>
                                    onUpdate({ dateFormat: value as any })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select date format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MM/DD/YYYY">
                                        MM/DD/YYYY
                                    </SelectItem>
                                    <SelectItem value="DD/MM/YYYY">
                                        DD/MM/YYYY
                                    </SelectItem>
                                    <SelectItem value="YYYY-MM-DD">
                                        YYYY-MM-DD
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timeFormat">Time Format</Label>
                        <Select
                            value={settings.timeFormat}
                            onValueChange={(value) =>
                                onUpdate({ timeFormat: value as any })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select time format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12h">
                                    12-hour (AM/PM)
                                </SelectItem>
                                <SelectItem value="24h">24-hour</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Behavior */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Behavior
                    </CardTitle>
                    <CardDescription>
                        Configure how the application behaves
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="autoSave">Auto-save changes</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically save your changes as you work
                            </p>
                        </div>
                        <Switch
                            id="autoSave"
                            checked={settings.autoSave}
                            onCheckedChange={(checked) =>
                                onUpdate({ autoSave: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="confirmActions">
                                Confirm actions
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Show confirmation dialogs for destructive
                                actions
                            </p>
                        </div>
                        <Switch
                            id="confirmActions"
                            checked={settings.confirmActions}
                            onCheckedChange={(checked) =>
                                onUpdate({ confirmActions: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
