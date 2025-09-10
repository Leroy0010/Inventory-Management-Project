import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Eye, CheckCircle, XCircle, Clock, User, Package } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import type { RequestResponseDto, RequestStatus } from '@/types/request';
import type { Role } from '@/types/auth';
import { formatDate, getStatusBadgeVariant } from '@/lib/request-utils';

interface RequestTableProps {
    requests: RequestResponseDto[];
    onViewDetails: (request: RequestResponseDto) => void;
    onApprove?: (request: RequestResponseDto) => void;
    onReject?: (request: RequestResponseDto) => void;
    onFulfill?: (request: RequestResponseDto) => void;
    isUpdating: boolean;
    userRole: Role["name"];
}

const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
        case 'PENDING':
            return <Clock className="h-3 w-3" />;
        case 'APPROVED':
            return <CheckCircle className="h-3 w-3" />;
        case 'FULFILLED':
            return <Package className="h-3 w-3" />;
        case 'REJECTED':
            return <XCircle className="h-3 w-3" />;
        default:
            return <Clock className="h-3 w-3" />;
    }
};


export default function RequestTable({
    requests,
    onViewDetails,
    onApprove,
    onReject,
    onFulfill,
    isUpdating,
    userRole,
}: RequestTableProps) {
    const { hasPermission } = usePermissions();


    const getActionButtons = (request: RequestResponseDto) => {
        const buttons = [];

        // View Details button (always available)
        buttons.push(
            <Button
                key="view"
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(request)}
                disabled={isUpdating}
                aria-label={`View details for request ${request.id}`}
            >
                <Eye className="h-3 w-3 mr-1" />
                View
            </Button>
        );

        // Role-specific action buttons
        if (userRole === 'STOREKEEPER' && request.status === 'PENDING') {
            if (hasPermission('APPROVE_REQUESTS') && onApprove) {
                buttons.push(
                    <Button
                        key="approve"
                        variant="default"
                        size="sm"
                        onClick={() => onApprove(request)}
                        disabled={isUpdating}
                        aria-label={`Approve request ${request.id}`}
                    >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                    </Button>
                );
            }
            if (hasPermission('REJECT_REQUESTS') && onReject) {
                buttons.push(
                    <Button
                        key="reject"
                        variant="destructive"
                        size="sm"
                        onClick={() => onReject(request)}
                        disabled={isUpdating}
                        aria-label={`Reject request ${request.id}`}
                    >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                    </Button>
                );
            }
        }

        if (userRole === 'STAFF' && request.status === 'APPROVED' && onFulfill) {
            buttons.push(
                <Button
                    key="fulfill"
                    variant="default"
                    size="sm"
                    onClick={() => onFulfill(request)}
                    disabled={isUpdating}
                    aria-label={`Fulfill request ${request.id}`}
                >
                    <Package className="h-3 w-3 mr-1" />
                    Fulfill
                </Button>
            );
        }

        return buttons;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Requests</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Submitted By</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Approver</TableHead>
                            <TableHead>Fulfiller</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    <Badge variant="outline">
                                        #{request.id}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>User {request.user_id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {formatDate(request.submittedAt)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(request.status)}>
                                        <div className="flex items-center space-x-1">
                                            
                                            {getStatusIcon(request.status)}
                                            <span>{request.status}</span>
                                        </div>
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-1">
                                        <Package className="h-3 w-3 text-muted-foreground" />
                                        <span>{request.items.length}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {request.approver ? (
                                        <div className="flex items-center space-x-1">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                            <span>{request.approver.firstName} {request.approver.lastName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {request.fulfiller ? (
                                        <div className="flex items-center space-x-1">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                            <span>{request.fulfiller.firstName} {request.fulfiller.lastName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        {getActionButtons(request)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
