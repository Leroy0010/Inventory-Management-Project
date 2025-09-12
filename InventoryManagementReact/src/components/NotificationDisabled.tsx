import { Bell, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function NotificationDisabled() {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Notifications Disabled
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            The notification system is currently disabled for
                            development.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Bell className="w-4 h-4" />
                        <span>No notifications available</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
