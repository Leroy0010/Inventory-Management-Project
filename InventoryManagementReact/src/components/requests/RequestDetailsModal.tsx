import { useNavigate } from 'react-router-dom';
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
    Package,
    ExternalLink,
} from 'lucide-react';
import type { RequestResponseDto, RequestStatus } from '@/types/request';
import StatusHistory from './request-details-modal/StatusHistory';
import RequestedItems from './request-details-modal/RequestedItems';
import FulfillmentInformation from './request-details-modal/FulFillmentInformation';
import ApprovalInformation from './request-details-modal/ApprovalInformation';
import RequestSummary from './request-details-modal/RequestSummary';

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

export type StatusBadgeVariant = 'secondary' | 'default' | 'destructive';

const getStatusBadgeVariant = (status: RequestStatus): StatusBadgeVariant => {
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
    const navigate = useNavigate();

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

        if (
            userRole === 'STAFF' &&
            request.status === 'APPROVED' &&
            onFulfill
        ) {
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

    const handleViewFullScreen = () => {
        // Close the modal first
        onClose();
        // Navigate to the full page view
        navigate(`/requests/${request.id}`);
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
                    <RequestSummary
                        request={request}
                        formatDate={formatDate}
                        getStatusBadgeVariant={getStatusBadgeVariant}
                        getStatusIcon={getStatusIcon}
                    />
                    
                    {/* Approval Information */}
                    {request.approvedAt && request.approver && (
                        <ApprovalInformation
                            request={request}
                            formatDate={formatDate}
                        />
                    )}

                    {/* Fulfillment Information */}
                    {request.fulfilledAt && request.fulfiller && (
                        <FulfillmentInformation
                            formatDate={formatDate}
                            request={request}
                        />
                    )}

                    {/* Requested Items */}
                    <RequestedItems request={request} />

                    {/* Status History */}
                    {request.statusHistory &&
                        request.statusHistory.length > 0 && (
                            <StatusHistory
                                request={request}
                                getStatusBadgeVariant={getStatusBadgeVariant}
                                formatDate={formatDate}
                            />
                        )}
                </div>

                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        {/* Full Screen Button */}
                        <Button
                            variant="outline"
                            onClick={handleViewFullScreen}
                            className="flex items-center space-x-2 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Full Screen</span>
                        </Button>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            {getActionButtons()}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
