import { api, handleApiError } from './client';
import type { CreateBatchDto, InventoryBatch } from '@/types/inventoryBatch';

// Batch API functions based on Spring Boot InventoryBatchController
export const batchApi = {
    // Get all batches
    getBatches: async (): Promise<InventoryBatch[]> => {
        try {
            return await api.get<InventoryBatch[]>('/api/batches');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Create new inventory batch
    createBatch: async (batch: CreateBatchDto): Promise<InventoryBatch> => {
        try {
            return await api.post<InventoryBatch>('/api/batch', batch);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
