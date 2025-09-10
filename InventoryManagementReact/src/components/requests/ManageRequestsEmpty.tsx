import type { RequestResponseDto } from '@/types/request';
import RequestHeader from './RequestHeader';
import RequestFilters from './RequestFilters';
import { Card, CardContent } from '../ui/card';
import { Package } from 'lucide-react';

interface ManageRequestEmptyProps {
    requests: RequestResponseDto[];
    isLoading: boolean;
    handleRefresh: () => void;
    setShowFilters: (value: boolean) => void;
    searchQuery: string;
    showFilters: boolean;
    statusFilter: string;
    setSearchQuery: (value: string) => void;
    setStatusFilter: (status: string) => void;
    handleClearFilters: () => void;
    handleApplyFilters: () => void;
}

export default function ManageRequestsEmpty({
    requests,
    isLoading,
    handleRefresh,
    setShowFilters,
    searchQuery,
    showFilters,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    handleApplyFilters,
    handleClearFilters,
}: ManageRequestEmptyProps) {
    return (
        <div className="space-y-6">
            <RequestHeader
                title="Manage Requests"
                totalRequests={requests.length}
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

            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        No requests found
                    </h3>
                    <p className="text-muted-foreground text-center mb-6">
                        {searchQuery || statusFilter !== 'all'
                            ? 'No requests match your current filters. Try adjusting your search criteria.'
                            : 'There are no requests in your department yet.'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
