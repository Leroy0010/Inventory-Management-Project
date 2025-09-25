import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import type { AdvancedSettings } from '@/types/settings';

interface ApiConfigurationProps {
    settings: AdvancedSettings;
    onUpdate: (settings: Partial<AdvancedSettings>) => void;
    isLoading?: boolean;
}

export function ApiConfiguration({
    settings,
    onUpdate,
    isLoading,
}: ApiConfigurationProps) {
    return (
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
    );
}
