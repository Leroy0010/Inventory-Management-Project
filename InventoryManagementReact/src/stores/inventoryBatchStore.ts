import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api, handleApiError } from '@/api/client';
import type { InventoryBatch, CreateBatchDto } from '@/types/inventoryBatch';

export interface InventoryBatchState {
    batches: InventoryBatch[];
    isLoading: boolean;
    error: string | null;
}

export interface InventoryBatchActions {
    // Batches management
    fetchBatches: () => Promise<void>;
    createBatch: (batch: CreateBatchDto) => Promise<InventoryBatch>;

    // Error handling
    setError: (error: string | null) => void;
    clearError: () => void;
}

export type InventoryBatchStore = InventoryBatchState & InventoryBatchActions;

const initialState: InventoryBatchState = {
    batches: [],
    isLoading: false,
    error: null,
};

export const useInventoryBatchStore = create<InventoryBatchStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Fetch batches
            fetchBatches: async () => {
                set({ isLoading: true, error: null });

                try {
                    const batches = await api.get<InventoryBatch[]>('/api/inventory-batches');
                    set({ batches: batches || [], isLoading: false });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                }
            },

            // Create batch
            createBatch: async (batch: CreateBatchDto) => {
                set({ isLoading: true, error: null });

                try {
                    const newBatch = await api.post<InventoryBatch>('/api/inventory-batches', batch);

                    set((state) => ({
                        batches: [...state.batches, newBatch],
                        isLoading: false,
                    }));

                    return newBatch;
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Set error
            setError: (error) => {
                set({ error });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'inventory-batch-store',
        }
    )
);
