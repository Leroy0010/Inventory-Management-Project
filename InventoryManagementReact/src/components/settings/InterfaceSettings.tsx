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
import { Layout } from 'lucide-react';
import type { ApplicationSettings } from '@/types/settings';

interface InterfaceSettingsProps {
    settings: ApplicationSettings;
    onUpdate: (settings: Partial<ApplicationSettings>) => void;
    isLoading?: boolean;
}

const layouts = [
    {
        value: 'compact',
        label: 'Compact',
        description: 'More items per page',
    },
    {
        value: 'comfortable',
        label: 'Comfortable',
        description: 'Balanced spacing',
    },
    {
        value: 'spacious',
        label: 'Spacious',
        description: 'More breathing room',
    },
];

const pageSizes = [
    { value: '10', label: '10 items' },
    { value: '25', label: '25 items' },
    { value: '50', label: '50 items' },
    { value: '100', label: '100 items' },
];

export function InterfaceSettings({
    settings,
    onUpdate,
    isLoading,
}: InterfaceSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Interface
                </CardTitle>
                <CardDescription>
                    Customize the appearance and layout of the application
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                        label="Dashboard Layout"
                        value={settings.dashboardLayout}
                        onValueChange={(value) =>
                            onUpdate({ dashboardLayout: value as any })
                        }
                        options={layouts}
                        placeholder="Select layout"
                        htmlFor="dashboardLayout"
                        className="space-y-2"
                    />

                    <SelectField
                        label="Default Page Size"
                        value={settings.defaultPageSize.toString()}
                        onValueChange={(value) =>
                            onUpdate({
                                defaultPageSize: parseInt(value) as any,
                            })
                        }
                        options={pageSizes}
                        placeholder="Select page size"
                        htmlFor="defaultPageSize"
                        className="space-y-2"
                    />
                </div>

                <Separator />

                <div className="space-y-4">
                    <SwitchField
                        id="compactMode"
                        label="Compact Mode"
                        description="Use smaller spacing and condensed layouts"
                        checked={settings.compactMode}
                        onCheckedChange={(checked) =>
                            onUpdate({ compactMode: checked })
                        }
                        disabled={isLoading}
                    />

                    <SwitchField
                        id="sidebarCollapsed"
                        label="Sidebar Collapsed"
                        description="Start with the sidebar collapsed by default"
                        checked={settings.sidebarCollapsed}
                        onCheckedChange={(checked) =>
                            onUpdate({ sidebarCollapsed: checked })
                        }
                        disabled={isLoading}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
