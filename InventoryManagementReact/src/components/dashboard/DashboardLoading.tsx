import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface DashboardLoadingProps {
    message?: string;
    description?: string;
}

export function DashboardLoading({
    message = 'Loading Dashboard',
    description = 'Please wait while we load your personalized dashboard...',
}: DashboardLoadingProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 text-center">
                <CardContent>
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">
                        {message}
                    </h2>
                    <p className="text-gray-500">{description}</p>
                </CardContent>
            </Card>
        </div>
    );
}
