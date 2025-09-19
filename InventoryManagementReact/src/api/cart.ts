import { api, handleApiError } from './client';
import type { CartItem, CartItemRequestDto } from '@/types/cart';

// Cart API functions based on JavaFX CartService
export const cartApi = {
    // Get current user's cart
    getCart: async (): Promise<CartItem[]> => {
        try {
            const response = await api.get<{ items: CartItem[] }>('/cart/get');
            return response.items || [];
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Add item to cart
    addItem: async (itemId: number, quantity: number): Promise<void> => {
        try {
            const request: CartItemRequestDto = {
                id: itemId,
                quantity: quantity
            };
            await api.post('/cart/add-item', request);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Remove item from cart
    removeItem: async (itemId: number, quantity: number): Promise<void> => {
        try {
            const request: CartItemRequestDto = {
                id: itemId,
                quantity: quantity
            };
            await api.post('/cart/remove-item', request);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Update item quantity in cart
    updateItem: async (itemId: number, quantity: number): Promise<void> => {
        try {
            const request: CartItemRequestDto = {
                id: itemId,
                quantity: quantity
            };
            await api.put('/cart/update-item', request);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Clear entire cart
    clearCart: async (): Promise<void> => {
        try {
            await api.delete('/cart/clear');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Submit cart as request (based on JavaFX RequestService.submitCartAsRequest)
    submitCartAsRequest: async (): Promise<{ id: number; message: string }> => {
        try {
            return await api.post<{ id: number; message: string }>('/requests');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};
