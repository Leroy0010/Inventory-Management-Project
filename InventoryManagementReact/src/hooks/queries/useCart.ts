import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cart';
import type { CartItem } from '@/types/cart';
import { cartErrorHandler } from '@/lib/cartErrorHandler';

// Query keys
export const cartKeys = {
    all: ['cart'] as const,
    cart: () => [...cartKeys.all, 'items'] as const,
    count: () => [...cartKeys.all, 'count'] as const,
};

// Hook for getting cart items
export function useCart(enabled: boolean = true) {
    const query = useQuery({
        queryKey: cartKeys.cart(),
        queryFn: cartApi.getCart,
        staleTime: 30000, // 30 seconds
        refetchOnWindowFocus: true,
        enabled,
    });

    // Handle errors with toast notifications
    if (query.error) {
        cartErrorHandler.fetchCart(query.error);
    }

    return query;
}

// Hook for getting cart count
export function useCartCount(enabled: boolean = true) {
    const { data: cartItems = [], isLoading } = useCart(enabled);
    const totalItems = cartItems.length;

    return {
        data: totalItems,
        isLoading,
    };
}

// Hook for adding item to cart
export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            itemId,
            quantity,
        }: {
            itemId: number;
            quantity: number;
        }) => cartApi.addItem(itemId, quantity),
        onSuccess: (_, variables) => {
            // Invalidate and refetch cart data
            queryClient.invalidateQueries({ queryKey: cartKeys.all });

            // Show success toast
            cartErrorHandler.success({
                operation: 'add',
                itemId: variables.itemId,
                quantity: variables.quantity,
            });
        },
        onError: (error, variables) => {
            // Show error toast with context
            cartErrorHandler.addItem(
                error,
                `Item ${variables.itemId}`,
                variables.quantity
            );
        },
    });
}

// Hook for removing item from cart
export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            itemId,
            quantity,
        }: {
            itemId: number;
            quantity: number;
        }) => cartApi.removeItem(itemId, quantity),
        onSuccess: (_, variables) => {
            // Invalidate and refetch cart data
            queryClient.invalidateQueries({ queryKey: cartKeys.all });

            // Show success toast
            cartErrorHandler.success({
                operation: 'remove',
                itemId: variables.itemId,
                quantity: variables.quantity,
            });
        },
        onError: (error, variables) => {
            // Show error toast with context
            cartErrorHandler.removeItem(
                error,
                `Item ${variables.itemId}`,
                variables.quantity
            );
        },
    });
}

// Hook for updating item quantity in cart
export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            itemId,
            quantity,
        }: {
            itemId: number;
            quantity: number;
        }) => cartApi.updateItem(itemId, quantity),
        onSuccess: (_, variables) => {
            // Invalidate and refetch cart data
            queryClient.invalidateQueries({ queryKey: cartKeys.all });

            // Show success toast
            cartErrorHandler.success({
                operation: 'update',
                itemId: variables.itemId,
                quantity: variables.quantity,
            });
        },
        onError: (error, variables) => {
            // Show error toast with context
            cartErrorHandler.updateItem(
                error,
                `Item ${variables.itemId}`,
                variables.quantity
            );
        },
    });
}

// Hook for clearing cart
export function useClearCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            // Invalidate and refetch cart data
            queryClient.invalidateQueries({ queryKey: cartKeys.all });

            // Show success toast
            cartErrorHandler.success({
                operation: 'clear',
            });
        },
        onError: (error) => {
            // Show error toast
            cartErrorHandler.clearCart(error);
        },
    });
}

// Hook for submitting cart as request
export function useSubmitCartAsRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.submitCartAsRequest,
        onSuccess: (data) => {
            // Invalidate and refetch cart data
            queryClient.invalidateQueries({ queryKey: cartKeys.all });

            // Show success toast with request ID
            cartErrorHandler.success({
                operation: 'submit',
            });
        },
        onError: (error) => {
            // Show error toast
            cartErrorHandler.submitRequest(error);
        },
    });
}

// Hook to check if an item is in cart
export function useIsItemInCart(itemId: number, enabled: boolean = true) {
    const { data: cartItems = [], isLoading } = useCart(enabled);

    const isInCart = cartItems.some(
        (cartItem: CartItem) => cartItem.itemId === itemId
    );
    const cartItem = cartItems.find(
        (cartItem: CartItem) => cartItem.itemId === itemId
    );

    return {
        isInCart,
        cartItem,
        isLoading,
    };
}

// Combined hook for all cart operations
export function useCartQueries(enabled: boolean = true) {
    const cart = useCart(enabled);
    const cartCount = useCartCount(enabled);
    const addToCart = useAddToCart();
    const removeFromCart = useRemoveFromCart();
    const updateCartItem = useUpdateCartItem();
    const clearCart = useClearCart();
    const submitCartAsRequest = useSubmitCartAsRequest();

    return {
        cart,
        cartCount,
        cartItemsQuery: cart,
        addItemMutation: addToCart,
        removeItemMutation: removeFromCart,
        updateItemMutation: updateCartItem,
        clearCartMutation: clearCart,
        submitCartAsRequestMutation: submitCartAsRequest,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
    };
}
