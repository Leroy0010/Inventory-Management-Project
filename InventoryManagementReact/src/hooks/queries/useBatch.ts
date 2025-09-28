import { useBatches } from './useBatches';
import { useCreateBatch } from './useCreateBatch';

// Barrel exports for all batch-related hooks
export { useBatches } from './useBatches';
export { useCreateBatch } from './useCreateBatch';
export { batchKeys } from './batchKeys';

// Legacy export for backward compatibility
export function useBatchQueries() {
    // This is now deprecated - components should use individual hooks
    console.warn(
        'useBatchQueries is deprecated. Use individual hooks like useBatches, useCreateBatch, etc.'
    );

    return {
        batchesQuery: useBatches(),
        createBatchMutation: useCreateBatch(),
    };
}
