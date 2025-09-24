import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi } from '@/api/cart';
import type { CartItem } from '@/types/cart';
import { useQueryClient } from '@tanstack/react-query';

interface CartState {
    cartItems: CartItem[];
    totalItems: number;
    isLoading: boolean;
    setCartItems: (items: CartItem[]) => void;
    addItem: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number, quantity: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            totalItems: 0,
            isLoading: false,

            setCartItems: (items) => {
                const totalItems = items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );
                set({ cartItems: items, totalItems });
            },

            addItem: async (itemId, quantity) => {
                set({ isLoading: true });
                try {
                    await cartApi.addItem(itemId, quantity);
                    await get().fetchCart();
                } catch (error) {
                    // Failed to add item to cart
                } finally {
                    set({ isLoading: false });
                }
            },

            removeItem: async (itemId, quantity) => {
                set({ isLoading: true });
                try {
                    await cartApi.removeItem(itemId, quantity);
                    await get().fetchCart();
                } catch (error) {
                    // Failed to remove item from cart
                } finally {
                    set({ isLoading: false });
                }
            },

            updateQuantity: async (itemId, quantity) => {
                set({ isLoading: true });
                try {
                    if (quantity <= 0) {
                        await cartApi.removeItem(itemId, 0);
                    } else {
                        await cartApi.updateItem(itemId, quantity);
                    }
                    await get().fetchCart();
                } catch (error) {
                    // Failed to update item quantity
                } finally {
                    set({ isLoading: false });
                }
            },

            clearCart: async () => {
                set({ isLoading: true });
                try {
                    await cartApi.clearCart();
                    set({ cartItems: [], totalItems: 0 });
                } catch (error) {
                    // Failed to clear cart
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchCart: async () => {
                set({ isLoading: true });
                try {
                    const items = await cartApi.getCart();
                    const totalItems = items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    );
                    set({ cartItems: items, totalItems });
                } catch (error) {
                    // Failed to fetch cart
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
