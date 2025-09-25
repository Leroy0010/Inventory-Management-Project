import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SwitchField } from '@/components/common/SwitchField';
import { SliderField } from '@/components/common/SliderField';
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';
import type { ApplicationSettings } from '@/types/settings';

interface AutoRefreshSettingsProps {
    settings: ApplicationSettings;
    onUpdate: (settings: Partial<ApplicationSettings>) => void;
    isLoading?: boolean;
}

export function AutoRefreshSettings({
    settings,
    onUpdate,
    isLoading,
}: AutoRefreshSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Auto-refresh
                </CardTitle>
                <CardDescription>
                    Configure automatic data refreshing
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <SwitchField
                    id="autoRefresh"
                    label="Enable Auto-refresh"
                    description="Automatically refresh data at regular intervals"
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) =>
                        onUpdate({ autoRefresh: checked })
                    }
                    disabled={isLoading}
                />

                {settings.autoRefresh && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <SliderField
                                id="refreshInterval"
                                label={`Refresh Interval: ${settings.refreshInterval} seconds`}
                                value={settings.refreshInterval}
                                min={10}
                                max={300}
                                step={10}
                                onValueChange={(value) =>
                                    onUpdate({ refreshInterval: value })
                                }
                                disabled={isLoading}
                                rangeLabels={{ min: '10s', max: '5m' }}
                            />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
