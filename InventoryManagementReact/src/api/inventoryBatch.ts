import type { InventoryBatch, CreateBatchDto } from '@/types/inventoryBatch';
import { api, handleApiError } from './client';

export const inventoryBatchApi = {
    // Inventory Batches
    getBatches: async (): Promise<InventoryBatch[]> => {
        try {
            return await api.get<InventoryBatch[]>('/inventory-batches');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createBatch: async (batch: CreateBatchDto): Promise<InventoryBatch> => {
        try {
            return await api.post<InventoryBatch>(
                '/inventory-batches',
                batch
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
