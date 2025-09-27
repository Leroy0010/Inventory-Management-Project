import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Key, Smartphone, Mail } from 'lucide-react';

export function SecurityActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Security Actions
                </CardTitle>
                <CardDescription>
                    Take immediate security actions
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                    </Button>
                    <Button variant="outline" className="justify-start">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Manage Devices
                    </Button>
                    <Button variant="outline" className="justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        View Login History
                    </Button>
                    <Button variant="destructive" className="justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Sign Out All Devices
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
