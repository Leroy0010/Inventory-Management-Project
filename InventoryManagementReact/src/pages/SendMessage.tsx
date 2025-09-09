import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function SendMessage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Send Message
                </h1>
                <p className="text-muted-foreground">
                    Send messages to staff members
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Compose Message
                    </CardTitle>
                    <CardDescription>
                        Send messages to individual staff members or groups
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Message composer coming soon</p>
                        <p className="text-sm">
                            This feature will be implemented in the next phase
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
