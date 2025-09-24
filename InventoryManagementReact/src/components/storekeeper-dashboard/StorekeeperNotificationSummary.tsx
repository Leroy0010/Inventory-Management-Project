import { Bell } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import type { StorekeeperDashboard } from '@/types/dashboard';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

interface StorekeeperNotificationSummaryProps {
    dashboardData: StorekeeperDashboard | undefined;
    unreadCount: number;
}

export default function StorekeeperNotificationSummary({
    dashboardData,
    unreadCount,
}: StorekeeperNotificationSummaryProps) {
    const navigate = useNavigate();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Summary
                </CardTitle>
                <CardDescription>
                    Your recent notifications and alerts
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">
                                Unread Notifications
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">
                                {dashboardData?.unreadNotifications ||
                                    unreadCount ||
                                    0}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className='text-blue-600'
                                onClick={() => navigate('/notifications')}
                            >
                                View All
                            </Button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        {dashboardData?.unreadNotifications || unreadCount || 0}{' '}
                        unread notifications requiring your attention
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
