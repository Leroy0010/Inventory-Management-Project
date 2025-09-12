import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api, handleApiError } from '@/api/client';
import type { CartItem, CartItemRequestDto } from '@/types/cart';

// Types

export interface CartState {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    totalItems: number;
    isEmpty: boolean;
}

export interface CartActions {
    // Cart management
    fetchCart: () => Promise<void>;
    addItem: (item: CartItemRequestDto) => Promise<void>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;

    // Cart submission
    submitCartAsRequest: () => Promise<void>;

    // Error handling
    setError: (error: string | null) => void;
    clearError: () => void;
}

export type CartStore = CartState & CartActions;

// Initial state
const initialState: CartState = {
    items: [],
    isLoading: false,
    error: null,
    totalItems: 0,
    isEmpty: true,
};

// Cart store
export const useCartStore = create<CartStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Fetch cart items
            fetchCart: async () => {
                set({ isLoading: true, error: null });

                try {
                    const cartData = await api.get<{ items: CartItem[] }>('/api/cart');
                    const items = cartData.items || [];

                    set({
                        items,
                        totalItems: items.reduce(
                            (sum: number, item: CartItem) =>
                                sum + item.quantity,
                            0
                        ),
                        isEmpty: items.length === 0,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                }
            },

            // Add item to cart
            addItem: async (item: CartItemRequestDto) => {
                set({ isLoading: true, error: null });

                try {
                    const cartData = await api.post<{ items: CartItem[] }>('/api/cart/add', item);
                    const items = cartData.items || [];

                    set({
                        items,
                        totalItems: items.reduce(
                            (sum: number, item: CartItem) =>
                                sum + item.quantity,
                            0
                        ),
                        isEmpty: items.length === 0,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update item quantity
            updateItemQuantity: async (itemId: number, quantity: number) => {
                set({ isLoading: true, error: null });

                try {
                    const cartData = await api.put<{ items: CartItem[] }>('/api/cart/update', { itemId, quantity });
                    const items = cartData.items || [];

                    set({
                        items,
                        totalItems: items.reduce(
                            (sum: number, item: CartItem) =>
                                sum + item.quantity,
                            0
                        ),
                        isEmpty: items.length === 0,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Remove item from cart
            removeItem: async (itemId: number) => {
                set({ isLoading: true, error: null });

                try {
                    const cartData = await api.delete<{ items: CartItem[] }>('/api/cart/remove', { data: { itemId } });
                    const items = cartData.items || [];

                    set({
                        items,
                        totalItems: items.reduce(
                            (sum: number, item: CartItem) =>
                                sum + item.quantity,
                            0
                        ),
                        isEmpty: items.length === 0,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Clear cart
            clearCart: async () => {
                set({ isLoading: true, error: null });

                try {
                    await api.delete('/api/cart/clear');

                    set({
                        items: [],
                        totalItems: 0,
                        isEmpty: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: handleApiError(error),
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Submit cart as request
            submitCartAsRequest: async () => {
                set({ isLoading: true, error: null });

                try {
                    await api.post('/api/requests');

                    // Clear cart after successful submission
                    set({
                        items: [],
                        totalItems: 0,
                        isEmpty: true,
                        isLoading: false,
                    });
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
            name: 'cart-store',
        }
    )
);
