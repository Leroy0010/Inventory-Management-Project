import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SwitchField } from '@/components/common/SwitchField';
import { HelpCircle } from 'lucide-react';
import type { ApplicationSettings } from '@/types/settings';

interface HelpSupportSettingsProps {
    settings: ApplicationSettings;
    onUpdate: (settings: Partial<ApplicationSettings>) => void;
    isLoading?: boolean;
}

export function HelpSupportSettings({
    settings,
    onUpdate,
    isLoading,
}: HelpSupportSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Help & Support
                </CardTitle>
                <CardDescription>
                    Configure help and tutorial settings
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <SwitchField
                    id="showTutorials"
                    label="Show Tutorials"
                    description="Display helpful tutorials and tips"
                    checked={settings.showTutorials}
                    onCheckedChange={(checked) =>
                        onUpdate({ showTutorials: checked })
                    }
                    disabled={isLoading}
                />
            </CardContent>
        </Card>
    );
}
