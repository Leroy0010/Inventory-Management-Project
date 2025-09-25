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
import { Zap, Slack, MessageSquare, Mail } from 'lucide-react';
import type { AdvancedSettings } from '@/types/settings';

interface IntegrationsSettingsProps {
    settings: AdvancedSettings;
    onUpdate: (settings: Partial<AdvancedSettings>) => void;
    isLoading?: boolean;
}

export function IntegrationsSettings({
    settings,
    onUpdate,
    isLoading,
}: IntegrationsSettingsProps) {
    return (
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
                                <Label htmlFor="slackIntegration">Slack</Label>
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
                                <Label htmlFor="emailIntegration">Email</Label>
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
    );
}
