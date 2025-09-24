import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Calendar,
    User,
    Package,
    CheckCircle,
    XCircle,
    Clock,
    MessageSquare,
    FileText,
    DollarSign,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useRequestQueries } from '@/hooks/queries/useRequests';
import type { RequestResponseDto, RequestStatus } from '@/types/request';

// Legacy interfaces for features not yet supported by backend
// TODO: Remove these when backend supports the additional features

interface LegacyRequestItem {
    id: string;
    inventoryItemId: string;
    itemName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
}

interface LegacyRequest {
    id: string;
    type: 'INVENTORY_REQUEST' | 'APPROVAL_REQUEST' | 'TRANSFER_REQUEST';
    title: string;
    description: string;
    requesterId: string;
    requesterName: string;
    requesterEmail: string;
    approverId?: string;
    approverName?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    items: LegacyRequestItem[];
    totalValue: number;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    notes?: string;
}

export default function RequestDetails() {
    const { requestId } = useParams<{ requestId: string }>();
    const navigate = useNavigate();
    const { hasPermission } = usePermissions();
    const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    // Use API hooks
    const { getRequestByIdQuery, approveOrRejectRequestMutation } =
        useRequestQueries();

    // Get request data
    const requestIdNum = requestId ? parseInt(requestId, 10) : 0;
    const {
        data: request,
        isLoading: loading,
        error,
    } = getRequestByIdQuery(requestIdNum);

    // Error handling
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive">
                        Error Loading Request
                    </h2>
                    <p className="text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : 'An error occurred while loading the request.'}
                    </p>
                    <Button
                        onClick={() => navigate('/requests')}
                        className="mt-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Requests
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'FULFILLED':
                return 'bg-blue-100 text-blue-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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
                return null;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'LOW':
                return 'bg-blue-100 text-blue-800';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800';
            case 'HIGH':
                return 'bg-orange-100 text-orange-800';
            case 'URGENT':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleApprove = () => {
        if (!request) return;

        approveOrRejectRequestMutation.mutate({
            id: request.id,
            status: 'APPROVED',
            approve: true,
        });

        setIsApprovalDialogOpen(false);
        setApprovalNotes('');
    };

    const handleReject = () => {
        if (!request) return;

        approveOrRejectRequestMutation.mutate({
            id: request.id,
            status: 'REJECTED',
            approve: false,
        });

        setIsRejectionDialogOpen(false);
        setRejectionReason('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive">
                        Request Not Found
                    </h2>
                    <p className="text-muted-foreground">
                        The requested item could not be found.
                    </p>
                    <Button
                        onClick={() => navigate('/requests')}
                        className="mt-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Requests
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/requests')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Requests
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Request #{request.id}
                    </h1>
                    <p className="text-muted-foreground">
                        Submitted on{' '}
                        {new Date(request.submittedAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span>{request.status}</span>
                        </div>
                    </Badge>
                    {/* TODO: Add priority support when backend supports it */}
                    {/* <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                    </Badge> */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="h-5 w-5" />
                                <span>Request Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* TODO: Add description field when backend supports it */}
                            {/* <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Description
                                </Label>
                                <p className="text-lg">{request.description}</p>
                            </div> */}

                            {/* TODO: Add notes field when backend supports it */}
                            {/* {request.notes && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Notes
                                    </Label>
                                    <p className="text-lg">{request.notes}</p>
                                </div>
                            )} */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Requester ID
                                    </Label>
                                    <p className="text-lg flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>User #{request.user_id}</span>
                                    </p>
                                    {/* TODO: Add requester name and email when backend provides user details */}
                                    {/* <p className="text-sm text-muted-foreground">
                                        {request.requesterEmail}
                                    </p> */}
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Submitted
                                    </Label>
                                    <p className="text-lg flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(
                                                request.submittedAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            request.submittedAt
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            {request.approver && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Approver
                                    </Label>
                                    <p className="text-lg">
                                        {request.approver.firstName}{' '}
                                        {request.approver.lastName}
                                    </p>
                                </div>
                            )}

                            {request.fulfiller && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Fulfilled By
                                    </Label>
                                    <p className="text-lg">
                                        {request.fulfiller.firstName}{' '}
                                        {request.fulfiller.lastName}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Request Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Package className="h-5 w-5" />
                                <span>Requested Items</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        {/* TODO: Add SKU, Unit Price, and Total columns when backend supports them */}
                                        {/* <TableHead>SKU</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total</TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {request.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {item.name}
                                                </div>
                                                {/* TODO: Add item notes when backend supports them */}
                                                {/* {item.notes && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.notes}
                                                    </div>
                                                )} */}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <Package className="h-3 w-3" />
                                                    <span>{item.quantity}</span>
                                                </div>
                                            </TableCell>
                                            {/* TODO: Add SKU, Unit Price, and Total when backend supports them */}
                                            {/* <TableCell>
                                                <Badge variant="outline">
                                                    {item.sku}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span>
                                                        {item.unitPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1 font-medium">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span>
                                                        {item.totalPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions and Summary */}
                <div className="space-y-6">
                    {/* Request Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Total Items</span>
                                <span className="font-medium">
                                    {request.items.length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Quantity</span>
                                <span className="font-medium">
                                    {request.items.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                    )}
                                </span>
                            </div>
                            {/* TODO: Add total value calculation when backend supports pricing */}
                            {/* <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Value</span>
                                    <span>
                                        ${request.totalValue.toFixed(2)}
                                    </span>
                                </div>
                            </div> */}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {hasPermission('APPROVE_REQUESTS') &&
                        request.status === 'PENDING' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Dialog
                                        open={isApprovalDialogOpen}
                                        onOpenChange={setIsApprovalDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                className="w-full"
                                                variant="default"
                                            >
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Approve Request
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Approve Request
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to
                                                    approve this request? This
                                                    action cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="approval-notes">
                                                        Approval Notes
                                                        (Optional)
                                                    </Label>
                                                    <Textarea
                                                        id="approval-notes"
                                                        value={approvalNotes}
                                                        onChange={(e) =>
                                                            setApprovalNotes(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Add any notes about this approval..."
                                                        className="min-h-[100px]"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setIsApprovalDialogOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleApprove}>
                                                    Approve Request
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog
                                        open={isRejectionDialogOpen}
                                        onOpenChange={setIsRejectionDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                className="w-full"
                                                variant="destructive"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Reject Request
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Reject Request
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Please provide a reason for
                                                    rejecting this request.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="rejection-reason">
                                                        Rejection Reason
                                                    </Label>
                                                    <Textarea
                                                        id="rejection-reason"
                                                        value={rejectionReason}
                                                        onChange={(e) =>
                                                            setRejectionReason(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Please explain why this request is being rejected..."
                                                        className="min-h-[100px]"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setIsRejectionDialogOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleReject}
                                                    disabled={
                                                        !rejectionReason.trim()
                                                    }
                                                >
                                                    Reject Request
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        )}

                    {/* Status History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5" />
                                <span>Status History</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Show status history if available */}
                            {request.statusHistory &&
                            request.statusHistory.length > 0 ? (
                                request.statusHistory.map((history, index) => (
                                    <div
                                        key={history.id || index}
                                        className="flex items-center space-x-3"
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                history.statusName === 'PENDING'
                                                    ? 'bg-yellow-500'
                                                    : history.statusName ===
                                                        'APPROVED'
                                                      ? 'bg-green-500'
                                                      : history.statusName ===
                                                          'FULFILLED'
                                                        ? 'bg-blue-500'
                                                        : history.statusName ===
                                                            'REJECTED'
                                                          ? 'bg-red-500'
                                                          : 'bg-gray-500'
                                            }`}
                                        ></div>
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
                                // Fallback to basic status display
                                <>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
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
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Request Rejected
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {/* TODO: Add rejection timestamp when backend supports it */}
                                                    Status: Rejected
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
