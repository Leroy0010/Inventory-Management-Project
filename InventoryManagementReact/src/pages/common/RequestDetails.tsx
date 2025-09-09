import React, { useState, useEffect } from 'react';
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

interface RequestItem {
    id: string;
    inventoryItemId: string;
    itemName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
}

interface Request {
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
    items: RequestItem[];
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
    const [request, setRequest] = useState<Request | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    // Mock data - replace with actual API calls
    useEffect(() => {
        if (!requestId) return;

        const mockRequest: Request = {
            id: requestId,
            type: 'INVENTORY_REQUEST',
            title: 'Office Supplies Request',
            description:
                'Request for essential office supplies for the finance department',
            requesterId: 'user-1',
            requesterName: 'John Smith',
            requesterEmail: 'john.smith@company.com',
            approverId: 'user-2',
            approverName: 'Jane Doe',
            status: 'PENDING',
            priority: 'MEDIUM',
            items: [
                {
                    id: '1',
                    inventoryItemId: 'inv-1',
                    itemName: 'A4 Paper Sheets',
                    sku: 'PAPER-A4-001',
                    quantity: 5,
                    unitPrice: 12.5,
                    totalPrice: 62.5,
                    notes: 'White A4 paper, 80gsm',
                },
                {
                    id: '2',
                    inventoryItemId: 'inv-2',
                    itemName: 'Blue Ballpoint Pens',
                    sku: 'PEN-BLUE-001',
                    quantity: 10,
                    unitPrice: 1.25,
                    totalPrice: 12.5,
                    notes: 'Standard blue ink',
                },
                {
                    id: '3',
                    inventoryItemId: 'inv-3',
                    itemName: 'Stapler',
                    sku: 'STAPLER-001',
                    quantity: 2,
                    unitPrice: 25.0,
                    totalPrice: 50.0,
                    notes: 'Heavy-duty stapler',
                },
            ],
            totalValue: 125.0,
            createdAt: '2024-01-20T10:30:00Z',
            updatedAt: '2024-01-20T14:45:00Z',
            notes: 'Please process this request as soon as possible for the upcoming project.',
        };

        setRequest(mockRequest);
        setLoading(false);
    }, [requestId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="h-3 w-3" />;
            case 'APPROVED':
                return <CheckCircle className="h-3 w-3" />;
            case 'REJECTED':
                return <XCircle className="h-3 w-3" />;
            case 'CANCELLED':
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
        // TODO: Implement API call
        console.log('Approving request:', requestId, approvalNotes);
        setIsApprovalDialogOpen(false);
        setApprovalNotes('');
    };

    const handleReject = () => {
        // TODO: Implement API call
        console.log('Rejecting request:', requestId, rejectionReason);
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
                        {request.title}
                    </h1>
                    <p className="text-muted-foreground">
                        Request #{request.id}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span>{request.status}</span>
                        </div>
                    </Badge>
                    <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                    </Badge>
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
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Description
                                </Label>
                                <p className="text-lg">{request.description}</p>
                            </div>

                            {request.notes && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Notes
                                    </Label>
                                    <p className="text-lg">{request.notes}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Requester
                                    </Label>
                                    <p className="text-lg flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>{request.requesterName}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {request.requesterEmail}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Created
                                    </Label>
                                    <p className="text-lg flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(
                                                request.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            request.createdAt
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            {request.approverName && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Approver
                                    </Label>
                                    <p className="text-lg">
                                        {request.approverName}
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
                                        <TableHead>Item</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {request.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {item.itemName}
                                                    </div>
                                                    {item.notes && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {item.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {item.sku}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <Package className="h-3 w-3" />
                                                    <span>{item.quantity}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span>
                                                        {item.unitPrice.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1 font-medium">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span>
                                                        {item.totalPrice.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
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
                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Value</span>
                                    <span>
                                        ${request.totalValue.toFixed(2)}
                                    </span>
                                </div>
                            </div>
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
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Request Created
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            request.createdAt
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

                            {request.status === 'REJECTED' &&
                                request.rejectedAt && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Request Rejected
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    request.rejectedAt
                                                ).toLocaleString()}
                                            </p>
                                            {request.rejectionReason && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Reason:{' '}
                                                    {request.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
