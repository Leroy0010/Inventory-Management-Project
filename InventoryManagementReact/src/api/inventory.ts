import { api, handleApiError } from './client';

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

export interface InventoryItemResponseDto {
    id: number;
    name: string;
    description: string;
    unit: string;
    reorderLevel: number;
    imagePath?: string;
    department: Department;
}

// Inventory API functions
export const inventoryApi = {
    // Inventory Items
    getItems: async (): Promise<InventoryItemResponseDto[]> => {
        try {
            return await api.get<InventoryItemResponseDto[]>(
                '/api/inventory-items/get-all-department'
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    getItemById: async (id: number): Promise<InventoryItem> => {
        try {
            return await api.get<InventoryItem>(`/api/inventory-items/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createItem: async (
        item: CreateInventoryItemDto
    ): Promise<InventoryItem> => {
        try {
            return await api.post<InventoryItem>('/api/inventory-items', item);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    updateItem: async (
        item: UpdateInventoryItemDto
    ): Promise<InventoryItem> => {
        try {
            return await api.put<InventoryItem>('/api/inventory-items', item);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    deleteItem: async (id: number): Promise<void> => {
        try {
            await api.delete('/api/inventory-items', { data: { id } });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Departments
    getDepartments: async (): Promise<Department[]> => {
        try {
            return await api.get<Department[]>('/api/departments');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createDepartment: async (name: string): Promise<Department> => {
        try {
            return await api.post<Department>('/api/departments', { name });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    updateDepartment: async (id: number, name: string): Promise<Department> => {
        try {
            return await api.put<Department>(`/api/departments/${id}`, {
                name,
            });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    deleteDepartment: async (id: number): Promise<void> => {
        try {
            await api.delete(`/api/departments/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Inventory Batches
    getBatches: async (): Promise<InventoryBatch[]> => {
        try {
            return await api.get<InventoryBatch[]>('/api/inventory-batches');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createBatch: async (batch: CreateBatchDto): Promise<InventoryBatch> => {
        try {
            return await api.post<InventoryBatch>(
                '/api/inventory-batches',
                batch
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Inventory Balance
    getInventoryBalance: async (): Promise<any[]> => {
        try {
            return await api.get<any[]>('/api/inventory-balance');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Stock Transactions
    getStockTransactions: async (): Promise<any[]> => {
        try {
            return await api.get<any[]>('/api/stock-transactions');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
