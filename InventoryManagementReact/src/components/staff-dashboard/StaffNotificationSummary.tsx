import { Card, CardContent } from '../ui/card';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export default function StaffNotificationSummary({unreadCount} : {unreadCount: number}) {
    const navigate = useNavigate()
    return (
        <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                        <p className="font-medium text-orange-800">
                            You have {unreadCount} unread notification
                            {unreadCount > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-orange-600">
                            Check your notifications for updates on your
                            requests
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/notifications')}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                        View Notifications
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
