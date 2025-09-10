import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cart';
import { toast } from 'sonner';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';

// Query keys
export const cartKeys = {
    all: ['cart'] as const,
    items: () => [...cartKeys.all, 'items'] as const,
};

// Cart queries
export const useCartQueries = () => {
    const queryClient = useQueryClient();

    // Get cart items
    const cartItemsQuery = useQuery({
        queryKey: cartKeys.items(),
        queryFn: cartApi.getCart,
        staleTime: 30000, // 30 seconds
        refetchOnWindowFocus: false,
    });

    // Add item to cart mutation
    const addItemMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            cartApi.addItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
            toast.success('Item added to cart');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to add item: ${friendlyMessage}`);
        },
    });

    // Remove item from cart mutation
    const removeItemMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            cartApi.removeItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
            toast.success('Item removed from cart');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to remove item: ${friendlyMessage}`);
        },
    });

    // Update item quantity mutation
    const updateItemMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            cartApi.updateItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
            toast.success('Cart updated');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to update cart: ${friendlyMessage}`);
        },
    });

    // Clear cart mutation
    const clearCartMutation = useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
            toast.success('Cart cleared');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to clear cart: ${friendlyMessage}`);
        },
    });

    // Submit cart as request mutation
    const submitCartAsRequestMutation = useMutation({
        mutationFn: cartApi.submitCartAsRequest,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: cartKeys.items() });
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            toast.success(`Request submitted successfully! Request ID: ${data.id}`);
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to submit request: ${friendlyMessage}`);
        },
    });

    return {
        // Queries
        cartItemsQuery,
        
        // Mutations
        addItemMutation,
        removeItemMutation,
        updateItemMutation,
        clearCartMutation,
        submitCartAsRequestMutation,
    };
};
