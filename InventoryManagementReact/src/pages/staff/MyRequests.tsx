import { useState, useMemo } from 'react';
import { useRequestQueries } from '@/hooks/queries/useRequests';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';
import RequestHeader from '@/components/requests/RequestHeader';
import RequestTable from '@/components/requests/RequestTable';
import RequestDetailsModal from '@/components/requests/RequestDetailsModal';
import type { RequestResponseDto } from '@/types/request';
import MyRequestsError from '@/components/requests/MyRequestsError';
import MyRequestsEmpty from '@/components/requests/MyRequestsEmpty';
import MyRequestsSkeleton from '@/components/requests/MyRequestsSkeleton';

export default function MyRequests() {
    const [selectedRequest, setSelectedRequest] = useState<RequestResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const {
        userRequestsQuery,
        fulfillRequestMutation,
    } = useRequestQueries();

    const requests = useMemo(() => userRequestsQuery.data || [], [userRequestsQuery.data]);
    const isLoading = userRequestsQuery.isLoading;
    const error = userRequestsQuery.error;

    // Filter requests based on search and status
    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const matchesSearch = searchQuery === '' || 
                request.id.toString().includes(searchQuery) ||
                request.user_id.toString().includes(searchQuery) ||
                request.items.some(item => 
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            
            const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchQuery, statusFilter]);

    const handleViewDetails = (request: RequestResponseDto) => {
        setSelectedRequest(request);
        setIsDetailsModalOpen(true);
    };


    const handleFulfill = (request: RequestResponseDto) => {
        fulfillRequestMutation.mutate({
            requestId: request.id,
            status: 'FULFILLED',
            fulfilled: true,
        });
    };

    const handleRefresh = () => {
        userRequestsQuery.refetch();
    };

    // Loading state
    if (isLoading) {
        return <MyRequestsSkeleton />;
    }

    // Error state
    if (error) {
        const apiError = formatApiError(error);
        const friendlyMessage = getFriendlyErrorMessage(apiError);
        
        return <MyRequestsError friendlyMessage={friendlyMessage} handleRefresh={handleRefresh} />;
    }

    // Empty state
    if (filteredRequests.length === 0) {
        return <MyRequestsEmpty requests={requests} handleRefresh={handleRefresh} statusFilter={statusFilter} searchQuery={searchQuery} isLoading={isLoading} />;
    }

    // Main view
    return (
        <div className="space-y-6">
            <RequestHeader
                title="My Submitted Requests"
                totalRequests={filteredRequests.length}
                isLoading={isLoading}
                onRefresh={handleRefresh}
            />

            <RequestTable
                requests={filteredRequests}
                onViewDetails={handleViewDetails}
                onFulfill={handleFulfill}
                isUpdating={fulfillRequestMutation.isPending}
                userRole="STAFF"
            />

            <RequestDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                request={selectedRequest}
                onFulfill={handleFulfill}
                isUpdating={fulfillRequestMutation.isPending}
                userRole="STAFF"
            />
        </div>
    );
}
