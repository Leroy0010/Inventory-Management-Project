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
import { Bug } from 'lucide-react';
import type { AdvancedSettings } from '@/types/settings';

interface DebugLoggingSettingsProps {
    settings: AdvancedSettings;
    onUpdate: (settings: Partial<AdvancedSettings>) => void;
    isLoading?: boolean;
}

const logLevels = [
    { value: 'error', label: 'Error', description: 'Only error messages' },
    { value: 'warn', label: 'Warning', description: 'Warnings and errors' },
    { value: 'info', label: 'Info', description: 'General information' },
    {
        value: 'debug',
        label: 'Debug',
        description: 'Detailed debugging info',
    },
];

export function DebugLoggingSettings({
    settings,
    onUpdate,
    isLoading,
}: DebugLoggingSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Debug & Logging
                </CardTitle>
                <CardDescription>
                    Configure debugging and logging settings
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="debugMode">Debug Mode</Label>
                        <p className="text-sm text-muted-foreground">
                            Enable detailed debugging information
                        </p>
                    </div>
                    <Switch
                        id="debugMode"
                        checked={settings.debugMode}
                        onCheckedChange={(checked) =>
                            onUpdate({ debugMode: checked })
                        }
                        disabled={isLoading}
                    />
                </div>

                <Separator />

                <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select
                        value={settings.logLevel}
                        onValueChange={(value) =>
                            onUpdate({ logLevel: value as any })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select log level" />
                        </SelectTrigger>
                        <SelectContent>
                            {logLevels.map((level) => (
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
            </CardContent>
        </Card>
    );
}
