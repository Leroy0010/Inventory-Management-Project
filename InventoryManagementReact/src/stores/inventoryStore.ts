import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api, handleApiError } from '@/api/client';
import type {
    InventoryItem,
    CreateInventoryItemDto,
    UpdateInventoryItemDto,
} from '@/types/inventoryItem';

export interface InventoryState {
    items: InventoryItem[];
    isLoading: boolean;
    error: string | null;
    selectedItem: InventoryItem | null;
    filters: {
        searchQuery?: string;
        reorderLevel?: boolean;
    };
}

export interface InventoryActions {
    // Items management
    fetchItems: () => Promise<void>;
    fetchItemById: (id: number) => Promise<InventoryItem | null>;
    createItem: (item: CreateInventoryItemDto) => Promise<InventoryItem>;
    updateItem: (item: UpdateInventoryItemDto) => Promise<InventoryItem>;
    deleteItem: (id: number) => Promise<void>;

    // Filters and search
    setFilters: (filters: Partial<InventoryState['filters']>) => void;
    clearFilters: () => void;
    setSelectedItem: (item: InventoryItem | null) => void;

    // Error handling
    setError: (error: string | null) => void;
    clearError: () => void;
}

export type InventoryStore = InventoryState & InventoryActions;

// Initial state
const initialState: InventoryState = {
    items: [],
    isLoading: false,
    error: null,
    selectedItem: null,
    filters: {},
};

// Inventory store
export const useInventoryStore = create<InventoryStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Fetch all inventory items
            fetchItems: async () => {
                set({ isLoading: true, error: null });

                try {
                    const items = await api.get<InventoryItem[]>('/api/inventory-items/get-all-department');
                    set({ items: items || [], isLoading: false });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                }
            },

            // Fetch item by ID
            fetchItemById: async (id: number) => {
                try {
                    const item = await api.get<InventoryItem>(`/api/inventory-items/${id}`);
                    return item;
                } catch (error) {
                    set({
                        error: handleApiError(error),
                    });
                    return null;
                }
            },

            // Create new inventory item
            createItem: async (item: CreateInventoryItemDto) => {
                set({ isLoading: true, error: null });

                try {
                    const newItem = await api.post<InventoryItem>('/api/inventory-items', item);

                    set((state) => ({
                        items: [...state.items, newItem],
                        isLoading: false,
                    }));

                    return newItem;
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update inventory item
            updateItem: async (item: UpdateInventoryItemDto) => {
                set({ isLoading: true, error: null });

                try {
                    const updatedItem = await api.put<InventoryItem>('/api/inventory-items', item);

                    set((state) => ({
                        items: state.items.map((item) =>
                            item.id === updatedItem.id ? updatedItem : item
                        ),
                        isLoading: false,
                    }));

                    return updatedItem;
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Delete inventory item
            deleteItem: async (id: number) => {
                set({ isLoading: true, error: null });

                try {
                    await api.delete('/api/inventory-items', { data: { id } });

                    set((state) => ({
                        items: state.items.filter((item) => item.id !== id),
                        isLoading: false,
                    }));
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Set filters
            setFilters: (filters) => {
                set((state) => ({
                    filters: { ...state.filters, ...filters },
                }));
            },

            // Clear filters
            clearFilters: () => {
                set({ filters: {} });
            },

            // Set selected item
            setSelectedItem: (item) => {
                set({ selectedItem: item });
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
            name: 'inventory-store',
        }
    )
);
