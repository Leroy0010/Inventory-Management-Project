import { useParams, useNavigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { useRequestQueries } from '@/hooks/queries/useRequests';
import { RequestDetailsHeader } from '@/components/requests/RequestDetailsHeader';
import { RequestDetailsInfo } from '@/components/requests/RequestDetailsInfo';
import { RequestItemsTable } from '@/components/requests/RequestItemsTable';
import { RequestSummary } from '@/components/requests/RequestSummary';
import { RequestActions } from '@/components/requests/RequestActions';
import { RequestStatusHistory } from '@/components/requests/RequestStatusHistory';
import { RequestErrorState } from '@/components/requests/RequestErrorState';
import { RequestLoadingState } from '@/components/requests/RequestLoadingState';
import { RequestNotFoundState } from '@/components/requests/RequestNotFoundState';

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

    // Use API hooks
    const { getRequestByIdQuery, approveOrRejectRequestMutation, fulfillRequestMutation } =
        useRequestQueries();

    // Get request data
    const requestIdNum = requestId ? parseInt(requestId, 10) : 0;
    const {
        data: request,
        isLoading: loading,
        error,
    } = getRequestByIdQuery(requestIdNum);

    const handleBack = () => navigate('/requests');

    const handleApprove = () => {
        if (!request) return;
        approveOrRejectRequestMutation.mutate({
            id: request.id,
            status: 'APPROVED',
            approve: true,
        });
    };

    const handleReject = () => {
        if (!request) return;
        approveOrRejectRequestMutation.mutate({
            id: request.id,
            status: 'REJECTED',
            approve: false,
        });
    };

    const handleFulfill = () => {
        if (!request) return;
        fulfillRequestMutation.mutate({
            requestId: request.id,
            status: 'FULFILLED',
            fulfilled: true,
        });
    };

    // Error handling
    if (error) return <RequestErrorState error={error} onBack={handleBack} />;

    if (loading) return <RequestLoadingState />;

    if (!request) return <RequestNotFoundState onBack={handleBack} />;


    return (
        <div className="space-y-6">
            <RequestDetailsHeader request={request} onBack={handleBack} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request Information */}
                <div className="lg:col-span-2 space-y-6">
                    <RequestDetailsInfo request={request} />
                    <RequestItemsTable request={request} />
                </div>

                {/* Actions and Summary */}
                <div className="space-y-6">
                    <RequestSummary request={request} />
                    <RequestActions
                        request={request}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onFulFill={handleFulfill}
                        isUpdating={approveOrRejectRequestMutation.isPending || fulfillRequestMutation.isPending}
                        hasFulfillmentPermission={hasPermission('FULFIL_REQUESTS')}
                        hasPermission={hasPermission('APPROVE_REQUESTS')}
                    />
                    <RequestStatusHistory request={request} />
                </div>
            </div>
        </div>
    );
}
