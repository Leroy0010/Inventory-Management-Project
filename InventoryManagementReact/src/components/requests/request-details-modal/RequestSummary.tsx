import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RequestResponseDto, RequestStatus } from '@/types/request';
import type { StatusBadgeVariant } from '../RequestDetailsModal';
import type { ReactNode } from 'react';

interface RequestSummaryProps {
    request: RequestResponseDto;
    formatDate: (dateString: string) => string;
    getStatusBadgeVariant: (status: RequestStatus) => StatusBadgeVariant;
    getStatusIcon: (status: RequestStatus) => JSX.Element;
}

export default function RequestSummary({
    request,
    formatDate,
    getStatusBadgeVariant,
    getStatusIcon,
}: RequestSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Request Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Request ID
                        </label>
                        <p className="text-lg font-semibold">#{request.id}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Status
                        </label>
                        <div className="mt-1">
                            <Badge
                                variant={getStatusBadgeVariant(request.status)}
                            >
                                <div className="flex items-center space-x-1">
                                    {getStatusIcon(request.status)}
                                    <span>{request.status}</span>
                                </div>
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Submitted By
                        </label>
                        <p className="text-sm">User {request.user_id}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Submitted At
                        </label>
                        <p className="text-sm">
                            {formatDate(request.submittedAt)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
