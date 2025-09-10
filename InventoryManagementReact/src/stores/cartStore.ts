import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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
                    const response = await fetch('/api/cart', {
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch cart');
                    }

                    const cartData = await response.json();
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
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to fetch cart',
                        isLoading: false,
                    });
                }
            },

            // Add item to cart
            addItem: async (item: CartItemRequestDto) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/cart/add', {
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
                            errorData.message || 'Failed to add item to cart'
                        );
                    }

                    const cartData = await response.json();
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
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to add item to cart',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update item quantity
            updateItemQuantity: async (itemId: number, quantity: number) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/cart/update', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ itemId, quantity }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message ||
                                'Failed to update item quantity'
                        );
                    }

                    const cartData = await response.json();
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
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to update item quantity',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Remove item from cart
            removeItem: async (itemId: number) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/cart/remove', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ itemId }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message ||
                                'Failed to remove item from cart'
                        );
                    }

                    const cartData = await response.json();
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
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to remove item from cart',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Clear cart
            clearCart: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/cart/clear', {
                        method: 'DELETE',
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || 'Failed to clear cart'
                        );
                    }

                    set({
                        items: [],
                        totalItems: 0,
                        isEmpty: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to clear cart',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Submit cart as request
            submitCartAsRequest: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('/api/requests', {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message ||
                                'Failed to submit cart as request'
                        );
                    }

                    // Clear cart after successful submission
                    set({
                        items: [],
                        totalItems: 0,
                        isEmpty: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to submit cart as request',
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
