import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function CartNotes() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Important Notes</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                    • All requests require approval from your supervisor
                </p>
                <p>
                    • Items will be delivered to your office location
                </p>
                <p>
                    • You will be notified when your request is approved or rejected
                </p>
                <p>
                    • Contact your storekeeper if you have any questions
                </p>
            </CardContent>
        </Card>
    );
}
