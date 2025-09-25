import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Database, Bug, Webhook, Key } from 'lucide-react';

export function DeveloperTools() {
    return (
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
    );
}
