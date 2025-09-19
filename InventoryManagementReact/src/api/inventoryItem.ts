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
                '/inventory-items/get-all-department'
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    getItemById: async (id: number): Promise<InventoryItem> => {
        try {
            return await api.get<InventoryItem>(`/inventory-items/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createItem: async (
        item: CreateInventoryItemDto,
        imageFile?: File
    ): Promise<InventoryItem> => {
        try {
            // If there's an image file, use FormData for Google Drive upload
            if (imageFile) {
                const formData = new FormData();
                formData.append('name', item.name);
                formData.append('description', item.description ?? '');
                formData.append('unit', item.unit);
                formData.append('reorderLevel', item.reorderLevel.toString());
                formData.append('image', imageFile);

                return await api.post<InventoryItem>(
                    '/inventory-items/with-image',
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
                    '/inventory-items',
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
            return await api.put<InventoryItem>(`/inventory-items/${item.id}`, item);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    deleteItem: async (id: number): Promise<void> => {
        try {
            await api.delete(`/inventory-items/${id}`,);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Inventory Balance
    getInventoryBalance: async (): Promise<any> => {
        try {
            return await api.get<any>('/inventory/balance');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },


};
