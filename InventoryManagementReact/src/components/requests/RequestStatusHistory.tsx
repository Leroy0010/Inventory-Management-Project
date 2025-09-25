import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import type { RequestResponseDto } from '@/types/request';

interface RequestStatusHistoryProps {
    request: RequestResponseDto;
}

export function RequestStatusHistory({ request }: RequestStatusHistoryProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500';
            case 'APPROVED':
                return 'bg-green-500';
            case 'FULFILLED':
                return 'bg-blue-500';
            case 'REJECTED':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Status History</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {request.statusHistory && request.statusHistory.length > 0 ? (
                    request.statusHistory.map((history, index) => (
                        <div
                            key={history.id || index}
                            className="flex items-center space-x-3"
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${getStatusColor(history.statusName)}`}
                            />
                            <div>
                                <p className="text-sm font-medium">
                                    {history.statusName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        history.timestamp
                                    ).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    by {history.changedBy.firstName}{' '}
                                    {history.changedBy.lastName}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <div>
                                <p className="text-sm font-medium">
                                    Request Submitted
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        request.submittedAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {request.status === 'APPROVED' &&
                            request.approvedAt && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Request Approved
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(
                                                request.approvedAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                        {request.status === 'FULFILLED' &&
                            request.fulfilledAt && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Request Fulfilled
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(
                                                request.fulfilledAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                        {request.status === 'REJECTED' && (
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Request Rejected
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Status: Rejected
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
