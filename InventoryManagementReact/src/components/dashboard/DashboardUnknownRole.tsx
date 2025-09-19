import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface DashboardUnknownRoleProps {
    role: string;
}

export function DashboardUnknownRole({ role }: DashboardUnknownRoleProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 text-center">
                <CardContent>
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">
                        Unknown Role
                    </h2>
                    <p className="text-gray-500">
                        Your role "{role}" is not recognized. Please contact
                        your administrator.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
