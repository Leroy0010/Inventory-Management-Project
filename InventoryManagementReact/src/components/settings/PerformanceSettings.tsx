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
import { Database } from 'lucide-react';
import type { AdvancedSettings } from '@/types/settings';

interface PerformanceSettingsProps {
    settings: AdvancedSettings;
    onUpdate: (settings: Partial<AdvancedSettings>) => void;
    isLoading?: boolean;
}

const cacheTimeouts = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 240, label: '4 hours' },
];

export function PerformanceSettings({
    settings,
    onUpdate,
    isLoading,
}: PerformanceSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Performance
                </CardTitle>
                <CardDescription>
                    Optimize application performance and caching
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="cacheEnabled">Enable Caching</Label>
                        <p className="text-sm text-muted-foreground">
                            Cache data to improve performance
                        </p>
                    </div>
                    <Switch
                        id="cacheEnabled"
                        checked={settings.cacheEnabled}
                        onCheckedChange={(checked) =>
                            onUpdate({ cacheEnabled: checked })
                        }
                        disabled={isLoading}
                    />
                </div>

                {settings.cacheEnabled && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <Label htmlFor="cacheTimeout">Cache Timeout</Label>
                            <Select
                                value={settings.cacheTimeout.toString()}
                                onValueChange={(value) =>
                                    onUpdate({
                                        cacheTimeout: parseInt(value),
                                    })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timeout" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cacheTimeouts.map((timeout) => (
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
                    </>
                )}
            </CardContent>
        </Card>
    );
}
