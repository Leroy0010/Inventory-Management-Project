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

interface StorekeeperRecentRequestsProps {
    recentRequests: RecentRequest[];
    getStatusIcon: (value: RequestStatus) => ReactElement;
    getStatusColor: (value: RequestStatus) => string;
}

export default function StorekeeperRecentRequests({ getStatusIcon, recentRequests, getStatusColor}: StorekeeperRecentRequestsProps) {
    const navigate = useNavigate();
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Recent Requests
                        </CardTitle>
                        <CardDescription>
                            Latest staff requests requiring your attention
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/requests')}
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
                            onClick={() => navigate(`/requests/${request.id}`)}
                            className="flex items-center cursor-pointer justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                {getStatusIcon(request.status)}
                                <div>
                                    <p className="font-medium text-sm">
                                        {request.staffName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {request.itemName}{' '}
                                        {request.quantity > 0 &&
                                            `(Qty: ${request.quantity})`}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge
                                    className={`text-xs ${getStatusColor(request.status)}`}
                                >
                                    {request.status}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                    {request.timeAgo}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
