import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function DashboardNotAuthenticated() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 text-center">
                <CardContent>
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">
                        Not Authenticated
                    </h2>
                    <p className="text-gray-500">
                        Please log in to view your dashboard.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
