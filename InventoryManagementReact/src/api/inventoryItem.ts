import type {
    InventoryItemResponseDto,
    InventoryItem,
    CreateInventoryItemDto,
    UpdateInventoryItemDto,
} from '@/types/inventoryItem';
import { api, handleApiError } from './client';

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
        item: CreateInventoryItemDto,
        imageFile?: File
    ): Promise<InventoryItem> => {
        try {
            // If there's an image file, use FormData
            if (imageFile) {
                const formData = new FormData();
                formData.append('name', item.name);
                formData.append('description', item.description ?? '');
                formData.append('unit', item.unit);
                formData.append('reorderLevel', item.reorderLevel.toString());
                formData.append('image', imageFile);

                return await api.post<InventoryItem>(
                    '/api/inventory-items/with-image',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                // Regular JSON request for items without images
                return await api.post<InventoryItem>(
                    '/api/inventory-items',
                    item
                );
            }
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
    getDepartments: async (): Promise<any[]> => {
        try {
            return await api.get<any[]>('/api/departments');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createDepartment: async (name: string): Promise<any> => {
        try {
            return await api.post<any>('/api/departments', { name });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    updateDepartment: async (id: number, name: string): Promise<any> => {
        try {
            return await api.put<any>(`/api/departments/${id}`, { name });
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

    // Inventory Balance
    getInventoryBalance: async (): Promise<any> => {
        try {
            return await api.get<any>('/api/inventory/balance');
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
