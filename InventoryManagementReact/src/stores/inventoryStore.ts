import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
export interface InventoryItem {
    id: number;
    name: string;
    description: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
    department: Department;
    batches: InventoryBatch[];
}

export interface InventoryBatch {
    id: number;
    quantity: number;
    unitPrice: number;
    supplierName: string;
    invoiceId: string;
    receivedAt: string;
    inventoryItem: InventoryItem;
}

export interface Department {
    id: number;
    name: string;
}

export interface CreateInventoryItemDto {
    name: string;
    description: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
    departmentId: number;
}

export interface UpdateInventoryItemDto {
    id: number;
    name: string;
    description: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
    departmentId: number;
}

export interface CreateBatchDto {
    itemName: string;
    quantity: number;
    totalPrice: number;
    supplierName: string;
    invoiceId: string;
}

export interface InventoryState {
    items: InventoryItem[];
    departments: Department[];
    batches: InventoryBatch[];
    isLoading: boolean;
    error: string | null;
    selectedItem: InventoryItem | null;
    filters: {
        departmentId?: number;
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

    // Departments management
    fetchDepartments: () => Promise<void>;
    createDepartment: (name: string) => Promise<Department>;
    updateDepartment: (id: number, name: string) => Promise<Department>;
    deleteDepartment: (id: number) => Promise<void>;

    // Batches management
    fetchBatches: () => Promise<void>;
    createBatch: (batch: CreateBatchDto) => Promise<InventoryBatch>;

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
    departments: [],
    batches: [],
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
                    const response = await fetch(
                        '/api/inventory-items/get-all-department',
                        {
                            credentials: 'include',
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch inventory items');
                    }

                    const items = await response.json();
                    set({ items: items || [], isLoading: false });
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to fetch items',
                        isLoading: false,
                    });
                }
            },

            // Fetch item by ID
            fetchItemById: async (id: number) => {
                try {
                    const response = await fetch(`/api/inventory-items/${id}`, {
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch item');
                    }

                    const item = await response.json();
                    return item;
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to fetch item',
                    });
                    return null;
                }
            },

            // Create new inventory item
            createItem: async (item: CreateInventoryItemDto) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/inventory-items', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(item),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to create item'
                        );
                    }

                    const newItem = await response.json();

                    set((state) => ({
                        items: [...state.items, newItem],
                        isLoading: false,
                    }));

                    return newItem;
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to create item',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update inventory item
            updateItem: async (item: UpdateInventoryItemDto) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/inventory-items', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(item),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to update item'
                        );
                    }

                    const updatedItem = await response.json();

                    set((state) => ({
                        items: state.items.map((item) =>
                            item.id === updatedItem.id ? updatedItem : item
                        ),
                        isLoading: false,
                    }));

                    return updatedItem;
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to update item',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Delete inventory item
            deleteItem: async (id: number) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/inventory-items', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ id }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to delete item'
                        );
                    }

                    set((state) => ({
                        items: state.items.filter((item) => item.id !== id),
                        isLoading: false,
                    }));
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to delete item',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Fetch departments
            fetchDepartments: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/departments', {
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch departments');
                    }

                    const departments = await response.json();
                    set({ departments: departments || [], isLoading: false });
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to fetch departments',
                        isLoading: false,
                    });
                }
            },

            // Create department
            createDepartment: async (name: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/departments', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ name }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to create department'
                        );
                    }

                    const newDepartment = await response.json();

                    set((state) => ({
                        departments: [...state.departments, newDepartment],
                        isLoading: false,
                    }));

                    return newDepartment;
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to create department',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update department
            updateDepartment: async (id: number, name: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`/api/departments/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ name }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to update department'
                        );
                    }

                    const updatedDepartment = await response.json();

                    set((state) => ({
                        departments: state.departments.map((dept) =>
                            dept.id === updatedDepartment.id
                                ? updatedDepartment
                                : dept
                        ),
                        isLoading: false,
                    }));

                    return updatedDepartment;
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to update department',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Delete department
            deleteDepartment: async (id: number) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`/api/departments/${id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to delete department'
                        );
                    }

                    set((state) => ({
                        departments: state.departments.filter(
                            (dept) => dept.id !== id
                        ),
                        isLoading: false,
                    }));
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to delete department',
                        isLoading: false,
                    });
                    throw error;
                }
            },

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
