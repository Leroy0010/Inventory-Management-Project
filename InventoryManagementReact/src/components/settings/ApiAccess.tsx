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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon } from 'lucide-react';
import type { SecuritySettings } from '@/types/settings';

interface ApiAccessProps {
    settings: SecuritySettings;
    onUpdate: (settings: Partial<SecuritySettings>) => void;
    isLoading?: boolean;
}

export function ApiAccess({ settings, onUpdate, isLoading }: ApiAccessProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    API Access
                </CardTitle>
                <CardDescription>
                    Manage API access and integration settings
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="apiAccess">API Access</Label>
                        <p className="text-sm text-muted-foreground">
                            Allow third-party applications to access your data
                        </p>
                    </div>
                    <Switch
                        id="apiAccess"
                        checked={settings.apiAccess}
                        onCheckedChange={(checked) =>
                            onUpdate({ apiAccess: checked })
                        }
                        disabled={isLoading}
                    />
                </div>

                {settings.apiAccess && (
                    <>
                        <Separator />
                        <div className="rounded-lg border p-4 bg-muted/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">API Key</span>
                                <Badge variant="outline">Active</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Your API key is currently active and can be used
                                by authorized applications.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    View API Key
                                </Button>
                                <Button variant="outline" size="sm">
                                    Regenerate
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
