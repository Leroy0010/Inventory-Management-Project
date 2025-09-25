import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SelectField } from '@/components/common/SelectField';
import { SwitchField } from '@/components/common/SwitchField';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import type { ApplicationSettings } from '@/types/settings';

interface ReportsExportSettingsProps {
    settings: ApplicationSettings;
    onUpdate: (settings: Partial<ApplicationSettings>) => void;
    isLoading?: boolean;
}

const reportFormats = [
    { value: 'pdf', label: 'PDF', description: 'Portable Document Format' },
    {
        value: 'excel',
        label: 'Excel',
        description: 'Microsoft Excel format',
    },
    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
];

const exportLocations = [
    { value: 'downloads', label: 'Downloads folder' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'documents', label: 'Documents folder' },
    { value: 'custom', label: 'Custom location' },
];

export function ReportsExportSettings({
    settings,
    onUpdate,
    isLoading,
}: ReportsExportSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Reports & Export
                </CardTitle>
                <CardDescription>
                    Configure report generation and export settings
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                        label="Default Report Format"
                        value={settings.reportFormat}
                        onValueChange={(value) =>
                            onUpdate({ reportFormat: value as any })
                        }
                        options={reportFormats}
                        placeholder="Select format"
                        htmlFor="reportFormat"
                        className="space-y-2"
                    />

                    <SelectField
                        label="Export Location"
                        value={settings.exportLocation}
                        onValueChange={(value) =>
                            onUpdate({ exportLocation: value })
                        }
                        options={exportLocations}
                        placeholder="Select location"
                        htmlFor="exportLocation"
                        className="space-y-2"
                    />
                </div>

                <Separator />

                <SwitchField
                    id="autoExport"
                    label="Auto-export Reports"
                    description="Automatically export reports when generated"
                    checked={settings.autoExport}
                    onCheckedChange={(checked) =>
                        onUpdate({ autoExport: checked })
                    }
                    disabled={isLoading}
                />
            </CardContent>
        </Card>
    );
}
