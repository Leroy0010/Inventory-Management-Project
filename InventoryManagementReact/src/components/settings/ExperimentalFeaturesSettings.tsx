import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import type { AdvancedSettings } from '@/types/settings';

interface ExperimentalFeaturesSettingsProps {
    settings: AdvancedSettings;
    onUpdate: (settings: Partial<AdvancedSettings>) => void;
    isLoading?: boolean;
}

export function ExperimentalFeaturesSettings({
    settings,
    onUpdate,
    isLoading,
}: ExperimentalFeaturesSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Experimental Features
                </CardTitle>
                <CardDescription>
                    Enable experimental features that are still in development
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="experimentalFeatures">
                            Experimental Features
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Enable experimental features and beta functionality
                        </p>
                    </div>
                    <Switch
                        id="experimentalFeatures"
                        checked={settings.experimentalFeatures}
                        onCheckedChange={(checked) =>
                            onUpdate({ experimentalFeatures: checked })
                        }
                        disabled={isLoading}
                    />
                </div>

                {settings.experimentalFeatures && (
                    <div className="rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800 dark:text-yellow-200">
                                Warning
                            </span>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Experimental features may be unstable and could
                            cause unexpected behavior. Use with caution and
                            report any issues you encounter.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
