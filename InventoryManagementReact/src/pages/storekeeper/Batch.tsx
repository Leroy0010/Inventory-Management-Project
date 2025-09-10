import { useNavigate } from 'react-router-dom';
import { useBatchQueries } from '@/hooks/queries/useBatch';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';
import BatchHeader from '@/components/batch/BatchHeader';
import BatchTable from '@/components/batch/BatchTable';
import BatchEmpty from '@/components/batch/BatchEmpty';
import BatchError from '@/components/batch/BatchError';
import BatchSkeleton from '@/components/batch/BatchSkeleton';

export default function Batch() {
    const navigate = useNavigate();
    const { batchesQuery } = useBatchQueries();

    const batches = batchesQuery.data || [];
    const isLoading = batchesQuery.isLoading;
    const error = batchesQuery.error;

    const handleRefresh = () => {
        batchesQuery.refetch();
    };

    const handleCreateBatch = () => {
        navigate('/batch/add');
    };

    // Loading state
    if (isLoading) {
        return <BatchSkeleton />;
    }

    // Error state
    if (error) {
        const apiError = formatApiError(error);
        const friendlyMessage = getFriendlyErrorMessage(apiError);
        
        return (
            <div className="space-y-6">
                <BatchHeader
                    title="Inventory Batches"
                    totalBatches={0}
                    isLoading={isLoading}
                    onRefresh={handleRefresh}
                    onCreateBatch={handleCreateBatch}
                />
                <BatchError
                    errorMessage={friendlyMessage}
                    onRetry={handleRefresh}
                />
            </div>
        );
    }

    // Empty state
    if (batches.length === 0) {
        return (
            <div className="space-y-6">
                <BatchHeader
                    title="Inventory Batches"
                    totalBatches={0}
                    isLoading={isLoading}
                    onRefresh={handleRefresh}
                    onCreateBatch={handleCreateBatch}
                />
                <BatchEmpty onCreateBatch={handleCreateBatch} />
            </div>
        );
    }

    // Main view
    return (
        <div className="space-y-6">
            <BatchHeader
                title="Inventory Batches"
                totalBatches={batches.length}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onCreateBatch={handleCreateBatch}
            />

            <BatchTable batches={batches} isLoading={isLoading} />
        </div>
    );
}