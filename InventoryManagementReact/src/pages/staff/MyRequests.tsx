import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Package, RefreshCw } from 'lucide-react';
import { useRequestQueries } from '@/hooks/queries/useRequests';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';
import RequestHeader from '@/components/requests/RequestHeader';
import RequestTable from '@/components/requests/RequestTable';
import RequestDetailsModal from '@/components/requests/RequestDetailsModal';
import type { RequestResponseDto } from '@/types/request';

export default function MyRequests() {
    const [selectedRequest, setSelectedRequest] = useState<RequestResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const {
        userRequestsQuery,
        approveOrRejectRequestMutation,
        fulfillRequestMutation,
    } = useRequestQueries();

    const requests = userRequestsQuery.data || [];
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
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (error) {
        const apiError = formatApiError(error);
        const friendlyMessage = getFriendlyErrorMessage(apiError);
        
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Error Loading Requests
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {friendlyMessage}
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (filteredRequests.length === 0) {
        return (
            <div className="space-y-6">
                <RequestHeader
                    title="My Submitted Requests"
                    totalRequests={requests.length}
                    isLoading={isLoading}
                    onRefresh={handleRefresh}
                />

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No requests found
                        </h3>
                        <p className="text-muted-foreground text-center mb-6">
                            {searchQuery || statusFilter !== 'all' 
                                ? 'No requests match your current filters. Try adjusting your search criteria.'
                                : 'You haven\'t submitted any requests yet. Add items to your cart and submit a request.'
                            }
                        </p>
                        {!searchQuery && statusFilter === 'all' && (
                            <button
                                onClick={() => (window.location.href = '/cart')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Go to Cart
                            </button>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
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
