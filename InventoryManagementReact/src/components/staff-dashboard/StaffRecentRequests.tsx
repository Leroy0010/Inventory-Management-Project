import { FileText } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
    Card,
    CardTitle,
    CardContent,
    CardDescription,
    CardHeader,
} from '../ui/card';
import { Button } from '../ui/button';
import type { RecentRequest } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { RequestStatus } from '@/types/request';

interface StaffRecentRequestsProps {
    recentRequests: RecentRequest[];
    getStatusIcon: (value: RequestStatus) => ReactElement;
    getStatusColor: (value: RequestStatus) => string;
}

export default function StaffRecentRequests({
    getStatusColor,
    getStatusIcon,
    recentRequests,
}: StaffRecentRequestsProps) {
    const navigate = useNavigate();
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Recent Requests
                        </CardTitle>
                        <CardDescription>
                            Your latest item requests
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/my-requests')}
                    >
                        View All
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {recentRequests.map((request) => (
                        <div
                            key={request.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                {getStatusIcon(request.status)}
                                <div>
                                    <p className="font-medium text-sm">
                                        {request.itemName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Qty: {request.quantity} •{' '}
                                        {request.timeAgo}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                className={`text-xs ${getStatusColor(request.status)}`}
                            >
                                {request.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
