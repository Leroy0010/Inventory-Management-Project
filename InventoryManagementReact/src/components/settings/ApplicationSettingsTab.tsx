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
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
    Monitor,
    RefreshCw,
    Layout,
    FileText,
    Download,
    HelpCircle,
} from 'lucide-react';
import type { ApplicationSettings } from '@/types/settings';

interface ApplicationSettingsTabProps {
    settings: ApplicationSettings;
    onUpdate: (settings: Partial<ApplicationSettings>) => void;
    isLoading?: boolean;
}

export function ApplicationSettingsTab({
    settings,
    onUpdate,
    isLoading,
}: ApplicationSettingsTabProps) {
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
        { value: 10, label: '10 items' },
        { value: 25, label: '25 items' },
        { value: 50, label: '50 items' },
        { value: 100, label: '100 items' },
    ];

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

    return (
        <div className="space-y-6">
            {/* Interface */}
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
                        <div className="space-y-2">
                            <Label htmlFor="dashboardLayout">
                                Dashboard Layout
                            </Label>
                            <Select
                                value={settings.dashboardLayout}
                                onValueChange={(value) =>
                                    onUpdate({ dashboardLayout: value as any })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select layout" />
                                </SelectTrigger>
                                <SelectContent>
                                    {layouts.map((layout) => (
                                        <SelectItem
                                            key={layout.value}
                                            value={layout.value}
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {layout.label}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {layout.description}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="defaultPageSize">
                                Default Page Size
                            </Label>
                            <Select
                                value={settings.defaultPageSize.toString()}
                                onValueChange={(value) =>
                                    onUpdate({
                                        defaultPageSize: parseInt(value) as any,
                                    })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select page size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageSizes.map((size) => (
                                        <SelectItem
                                            key={size.value}
                                            value={size.value.toString()}
                                        >
                                            {size.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="compactMode">
                                    Compact Mode
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Use smaller spacing and condensed layouts
                                </p>
                            </div>
                            <Switch
                                id="compactMode"
                                checked={settings.compactMode}
                                onCheckedChange={(checked) =>
                                    onUpdate({ compactMode: checked })
                                }
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="sidebarCollapsed">
                                    Sidebar Collapsed
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Start with the sidebar collapsed by default
                                </p>
                            </div>
                            <Switch
                                id="sidebarCollapsed"
                                checked={settings.sidebarCollapsed}
                                onCheckedChange={(checked) =>
                                    onUpdate({ sidebarCollapsed: checked })
                                }
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Auto-refresh */}
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
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="autoRefresh">
                                Enable Auto-refresh
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically refresh data at regular intervals
                            </p>
                        </div>
                        <Switch
                            id="autoRefresh"
                            checked={settings.autoRefresh}
                            onCheckedChange={(checked) =>
                                onUpdate({ autoRefresh: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>

                    {settings.autoRefresh && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="refreshInterval">
                                        Refresh Interval:{' '}
                                        {settings.refreshInterval} seconds
                                    </Label>
                                    <Slider
                                        id="refreshInterval"
                                        min={10}
                                        max={300}
                                        step={10}
                                        value={[settings.refreshInterval]}
                                        onValueChange={([value]) =>
                                            onUpdate({ refreshInterval: value })
                                        }
                                        disabled={isLoading}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>10s</span>
                                        <span>5m</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Reports & Export */}
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
                        <div className="space-y-2">
                            <Label htmlFor="reportFormat">
                                Default Report Format
                            </Label>
                            <Select
                                value={settings.reportFormat}
                                onValueChange={(value) =>
                                    onUpdate({ reportFormat: value as any })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reportFormats.map((format) => (
                                        <SelectItem
                                            key={format.value}
                                            value={format.value}
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {format.label}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {format.description}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="exportLocation">
                                Export Location
                            </Label>
                            <Select
                                value={settings.exportLocation}
                                onValueChange={(value) =>
                                    onUpdate({ exportLocation: value })
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {exportLocations.map((location) => (
                                        <SelectItem
                                            key={location.value}
                                            value={location.value}
                                        >
                                            {location.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="autoExport">
                                Auto-export Reports
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically export reports when generated
                            </p>
                        </div>
                        <Switch
                            id="autoExport"
                            checked={settings.autoExport}
                            onCheckedChange={(checked) =>
                                onUpdate({ autoExport: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Help & Support */}
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
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="showTutorials">
                                Show Tutorials
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Display helpful tutorials and tips
                            </p>
                        </div>
                        <Switch
                            id="showTutorials"
                            checked={settings.showTutorials}
                            onCheckedChange={(checked) =>
                                onUpdate({ showTutorials: checked })
                            }
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
