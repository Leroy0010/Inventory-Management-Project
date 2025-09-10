import { useState, useMemo } from 'react';
import { useRequestQueries } from '@/hooks/queries/useRequests';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';
import RequestHeader from '@/components/requests/RequestHeader';
import RequestTable from '@/components/requests/RequestTable';
import RequestFilters from '@/components/requests/RequestFilters';
import RequestDetailsModal from '@/components/requests/RequestDetailsModal';
import type { RequestResponseDto } from '@/types/request';
import ManageRequestsEmpty from '@/components/requests/ManageRequestsEmpty';
import ManageRequestsSkeleton from '@/components/requests/ManageRequestsSkeleton';
import ManageRequestsError from '@/components/requests/ManageRequestsError';

export default function ManageRequests() {
    const [selectedRequest, setSelectedRequest] =
        useState<RequestResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const { userRequestsQuery, approveOrRejectRequestMutation } =
        useRequestQueries();

    const requests = useMemo(
        () => userRequestsQuery.data || [],
        [userRequestsQuery.data]
    );
    const isLoading = userRequestsQuery.isLoading;
    const error = userRequestsQuery.error;

    // Filter requests based on search and status
    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const matchesSearch =
                searchQuery === '' ||
                request.id.toString().includes(searchQuery) ||
                request.user_id.toString().includes(searchQuery) ||
                request.items.some((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                );

            const matchesStatus =
                statusFilter === 'all' || request.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [requests, searchQuery, statusFilter]);

    const handleViewDetails = (request: RequestResponseDto) => {
        setSelectedRequest(request);
        setIsDetailsModalOpen(true);
    };

    const handleApprove = (request: RequestResponseDto) => {
        approveOrRejectRequestMutation.mutate({
            id: request.id,
            status: 'APPROVED',
            approve: true,
        });
    };

    const handleReject = (request: RequestResponseDto) => {
        approveOrRejectRequestMutation.mutate({
            id: request.id,
            status: 'REJECTED',
            approve: false,
        });
    };

    const handleRefresh = () => {
        userRequestsQuery.refetch();
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
    };

    const handleApplyFilters = () => {
        setShowFilters(false);
    };

    // Loading state
    if (isLoading) {
        return <ManageRequestsSkeleton />;
    }

    // Error state
    if (error) {
        const apiError = formatApiError(error);
        const friendlyMessage = getFriendlyErrorMessage(apiError);

        return <ManageRequestsError friendlyMessage={friendlyMessage} handleRefresh={handleRefresh} />;
    }

    // Empty state
    if (filteredRequests.length === 0) {
        return (
            <ManageRequestsEmpty
                requests={requests}
                isLoading={isLoading}
                handleApplyFilters={handleApplyFilters}
                handleClearFilters={handleClearFilters}
                handleRefresh={handleRefresh}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                setShowFilters={setShowFilters}
                showFilters={showFilters}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
        );
    }

    // Main view
    return (
        <div className="space-y-6">
            <RequestHeader
                title="Manage Requests"
                totalRequests={filteredRequests.length}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onFilter={() => setShowFilters(!showFilters)}
                showFilters={true}
            />

            {showFilters && (
                <RequestFilters
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onSearchChange={setSearchQuery}
                    onStatusChange={setStatusFilter}
                    onClearFilters={handleClearFilters}
                    onApplyFilters={handleApplyFilters}
                />
            )}

            <RequestTable
                requests={filteredRequests}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onReject={handleReject}
                isUpdating={approveOrRejectRequestMutation.isPending}
                userRole="STOREKEEPER"
            />

            <RequestDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                request={selectedRequest}
                onApprove={handleApprove}
                onReject={handleReject}
                isUpdating={approveOrRejectRequestMutation.isPending}
                userRole="STOREKEEPER"
            />
        </div>
    );
}
