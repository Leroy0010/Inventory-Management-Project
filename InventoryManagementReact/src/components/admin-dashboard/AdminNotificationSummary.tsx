import { Bell } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '../ui/card';
import { Button } from '../ui/button';
import type { AdminDashboard } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';

interface AdminNotificationSummaryProps {
    dashboardData: AdminDashboard | undefined;
    unreadCount: number;
}

export default function AdminNotificationSummary({
    dashboardData,
    unreadCount,
}: AdminNotificationSummaryProps) {
    const navigate = useNavigate();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Summary
                </CardTitle>
                <CardDescription>
                    System-wide notifications and alerts
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Unread Notifications
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {dashboardData?.unreadNotifications ||
                                    unreadCount ||
                                    0}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                onClick={() => navigate('/notifications')}
                            >
                                View All
                            </Button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {dashboardData?.unreadNotifications || unreadCount || 0}{' '}
                        unread notifications requiring your attention
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
