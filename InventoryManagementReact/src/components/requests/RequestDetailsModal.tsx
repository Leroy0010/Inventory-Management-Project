import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    Package
} from 'lucide-react';
import type { RequestResponseDto, RequestStatus } from '@/types/request';

interface RequestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: RequestResponseDto | null;
    onApprove?: (request: RequestResponseDto) => void;
    onReject?: (request: RequestResponseDto) => void;
    onFulfill?: (request: RequestResponseDto) => void;
    isUpdating: boolean;
    userRole: 'STAFF' | 'STOREKEEPER' | 'ADMIN';
}

const getStatusBadgeVariant = (status: RequestStatus) => {
    switch (status) {
        case 'PENDING':
            return 'secondary';
        case 'APPROVED':
            return 'default';
        case 'FULFILLED':
            return 'default';
        case 'REJECTED':
            return 'destructive';
        default:
            return 'secondary';
    }
};

const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
        case 'PENDING':
            return <Clock className="h-4 w-4" />;
        case 'APPROVED':
            return <CheckCircle className="h-4 w-4" />;
        case 'FULFILLED':
            return <Package className="h-4 w-4" />;
        case 'REJECTED':
            return <XCircle className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

export default function RequestDetailsModal({
    isOpen,
    onClose,
    request,
    onApprove,
    onReject,
    onFulfill,
    isUpdating,
    userRole,
}: RequestDetailsModalProps) {
    if (!request) return null;

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActionButtons = () => {
        const buttons = [];

        if (userRole === 'STOREKEEPER' && request.status === 'PENDING') {
            if (onApprove) {
                buttons.push(
                    <Button
                        key="approve"
                        onClick={() => onApprove(request)}
                        disabled={isUpdating}
                        aria-label={`Approve request ${request.id}`}
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                    </Button>
                );
            }
            if (onReject) {
                buttons.push(
                    <Button
                        key="reject"
                        variant="destructive"
                        onClick={() => onReject(request)}
                        disabled={isUpdating}
                        aria-label={`Reject request ${request.id}`}
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                    </Button>
                );
            }
        }

        if (userRole === 'STAFF' && request.status === 'APPROVED' && onFulfill) {
            buttons.push(
                <Button
                    key="fulfill"
                    onClick={() => onFulfill(request)}
                    disabled={isUpdating}
                    aria-label={`Fulfill request ${request.id}`}
                >
                    <Package className="h-4 w-4 mr-2" />
                    Fulfill
                </Button>
            );
        }

        return buttons;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>Request Details #{request.id}</span>
                    </DialogTitle>
                    <DialogDescription>
                        View and manage request information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Request Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Request ID</label>
                                    <p className="text-lg font-semibold">#{request.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <div className="mt-1">
                                        <Badge variant={getStatusBadgeVariant(request.status)}>
                                            <div className="flex items-center space-x-1">
                                                {getStatusIcon(request.status)}
                                                <span>{request.status}</span>
                                            </div>
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Submitted By</label>
                                    <p className="text-sm">User {request.user_id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Submitted At</label>
                                    <p className="text-sm">{formatDate(request.submittedAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Approval Information */}
                    {request.approvedAt && request.approver && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Approval Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Approved By</label>
                                        <p className="text-sm">{request.approver.firstName} {request.approver.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Approved At</label>
                                        <p className="text-sm">{formatDate(request.approvedAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Fulfillment Information */}
                    {request.fulfilledAt && request.fulfiller && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Fulfillment Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Fulfilled By</label>
                                        <p className="text-sm">{request.fulfiller.firstName} {request.fulfiller.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Fulfilled At</label>
                                        <p className="text-sm">{formatDate(request.fulfilledAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Requested Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Requested Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Quantity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {request.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {item.quantity}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Status History */}
                    {request.statusHistory && request.statusHistory.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Status History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Changed By</TableHead>
                                            <TableHead>Timestamp</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {request.statusHistory.map((history) => (
                                            <TableRow key={history.id}>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(history.statusName)}>
                                                        {history.statusName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {history.changedBy.firstName} {history.changedBy.lastName}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(history.timestamp)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {getActionButtons()}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
