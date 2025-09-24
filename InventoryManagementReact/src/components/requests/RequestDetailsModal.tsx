import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    CheckCircle,
    XCircle,
    Clock,
    Package,
} from 'lucide-react';
import type { RequestResponseDto, RequestStatus } from '@/types/request';
import StatusHistory from './request-details-modal/StatusHistory';
import RequestedItems from './request-details-modal/RequestedItems';
import FulfillmentInformation from './request-details-modal/FulFillmentInformation';
import ApprovalInformation from './request-details-modal/ApprovalInformation';
import RequestSummary from './request-details-modal/RequestSummary';
import { RequestDetailsHeader } from './RequestDetailsHeader';
import { RequestDetailsActions } from './RequestDetailsActions';

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

const RequestDetailsModal = memo(function RequestDetailsModal({
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


    const handleViewFullScreen = () => {
        // Close the modal first
        onClose();
        // Navigate to the full page view
        navigate(`/requests/${request.id}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[58rem] max-h-[80vh] overflow-y-auto">
                <RequestDetailsHeader request={request} />

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
                    <RequestDetailsActions
                        request={request}
                        userRole={userRole}
                        isUpdating={isUpdating}
                        onApprove={onApprove}
                        onReject={onReject}
                        onFulfill={onFulfill}
                        onViewFullScreen={handleViewFullScreen}
                        onClose={onClose}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

export default RequestDetailsModal;
