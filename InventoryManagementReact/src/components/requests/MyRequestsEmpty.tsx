import { Package } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import RequestHeader from './RequestHeader';
import type { RequestResponseDto } from '@/types/request';

interface MyRequestsEmptyProps {
    requests: RequestResponseDto[];
    isLoading: boolean;
    handleRefresh: () => void;
    searchQuery: string;
    statusFilter: string;
}

export default function MyRequestsEmpty({ requests, isLoading, searchQuery, statusFilter, handleRefresh }: MyRequestsEmptyProps) {
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
                            : "You haven't submitted any requests yet. Add items to your cart and submit a request."}
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
