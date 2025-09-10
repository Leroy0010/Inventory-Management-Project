import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { InventoryBatch, CreateBatchDto } from "@/types/inventoryBatch";


export interface InventoryBatchState {
    batches: InventoryBatch[]
    isLoading: boolean;
    error: string | null
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
    error: null
}

export const useInventoryBatchStore = create<InventoryBatchStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Fetch batches
            fetchBatches: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/inventory-batches', {
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch batches');
                    }

                    const batches = await response.json();
                    set({ batches: batches || [], isLoading: false });
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to fetch batches',
                        isLoading: false,
                    });
                }
            },

            // Create batch
            createBatch: async (batch: CreateBatchDto) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/inventory-batches', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(batch),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to create batch'
                        );
                    }

                    const newBatch = await response.json();

                    set((state) => ({
                        batches: [...state.batches, newBatch],
                        isLoading: false,
                    }));

                    return newBatch;
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to create batch',
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
)
