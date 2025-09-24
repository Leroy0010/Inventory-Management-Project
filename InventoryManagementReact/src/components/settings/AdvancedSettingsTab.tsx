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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Zap,
    Key,
    Webhook,
    Slack,
    MessageSquare,
    Mail,
    Bug,
    Database,
    FlaskConical,
    AlertTriangle,
} from 'lucide-react';
import type { AdvancedSettings } from '@/types/settings';

interface AdvancedSettingsTabProps {
    settings: AdvancedSettings;
    onUpdate: (settings: Partial<AdvancedSettings>) => void;
    isLoading?: boolean;
}

export function AdvancedSettingsTab({
    settings,
    onUpdate,
    isLoading,
}: AdvancedSettingsTabProps) {
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

    const cacheTimeouts = [
        { value: 5, label: '5 minutes' },
        { value: 15, label: '15 minutes' },
        { value: 30, label: '30 minutes' },
        { value: 60, label: '1 hour' },
        { value: 240, label: '4 hours' },
    ];

    return (
        <div className="space-y-6">
            {/* API Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Configuration
                    </CardTitle>
                    <CardDescription>
                        Configure API keys and webhook settings for integrations
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <div className="flex gap-2">
                            <Input
                                id="apiKey"
                                type="password"
                                value={settings.apiKey}
                                onChange={(e) =>
                                    onUpdate({ apiKey: e.target.value })
                                }
                                disabled={isLoading}
                                placeholder="Enter your API key"
                            />
                            <Button variant="outline" size="sm">
                                Generate
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Keep your API key secure and don't share it publicly
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="webhookUrl">Webhook URL</Label>
                        <Input
                            id="webhookUrl"
                            type="url"
                            value={settings.webhookUrl}
                            onChange={(e) =>
                                onUpdate({ webhookUrl: e.target.value })
                            }
                            disabled={isLoading}
                            placeholder="https://your-webhook-url.com/endpoint"
                        />
                        <p className="text-xs text-muted-foreground">
                            URL to receive webhook notifications
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Integrations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Integrations
                    </CardTitle>
                    <CardDescription>
                        Connect with external services and platforms
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Slack className="h-5 w-5 text-[#4A154B]" />
                                <div>
                                    <Label htmlFor="slackIntegration">
                                        Slack
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send notifications to Slack channels
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="slackIntegration"
                                checked={settings.integrations.slack}
                                onCheckedChange={(checked) =>
                                    onUpdate({
                                        integrations: {
                                            ...settings.integrations,
                                            slack: checked,
                                        },
                                    })
                                }
                                disabled={isLoading}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-[#0078D4]" />
                                <div>
                                    <Label htmlFor="teamsIntegration">
                                        Microsoft Teams
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send notifications to Teams channels
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="teamsIntegration"
                                checked={settings.integrations.teams}
                                onCheckedChange={(checked) =>
                                    onUpdate({
                                        integrations: {
                                            ...settings.integrations,
                                            teams: checked,
                                        },
                                    })
                                }
                                disabled={isLoading}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <Label htmlFor="emailIntegration">
                                        Email
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send notifications via email
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="emailIntegration"
                                checked={settings.integrations.email}
                                onCheckedChange={(checked) =>
                                    onUpdate({
                                        integrations: {
                                            ...settings.integrations,
                                            email: checked,
                                        },
                                    })
                                }
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Debug & Logging */}
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

            {/* Performance */}
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
                                <Label htmlFor="cacheTimeout">
                                    Cache Timeout
                                </Label>
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

            {/* Experimental Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5" />
                        Experimental Features
                    </CardTitle>
                    <CardDescription>
                        Enable experimental features that are still in
                        development
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="experimentalFeatures">
                                Experimental Features
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Enable experimental features and beta
                                functionality
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

            {/* Developer Tools */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Developer Tools
                    </CardTitle>
                    <CardDescription>
                        Tools and utilities for developers and power users
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-start">
                            <Database className="h-4 w-4 mr-2" />
                            Clear Cache
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Bug className="h-4 w-4 mr-2" />
                            Export Logs
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Webhook className="h-4 w-4 mr-2" />
                            Test Webhook
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Key className="h-4 w-4 mr-2" />
                            Validate API Key
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
