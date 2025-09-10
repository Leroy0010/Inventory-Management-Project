import { useState } from 'react';
import { useCartQueries } from '@/hooks/queries/useCart';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';
import CartHeader from '@/components/cart/CartHeader';
import CartTable from '@/components/cart/CartTable';
import CartSummary from '@/components/cart/CartSummary';
import CartActions from '@/components/cart/CartActions';
import CartNotes from '@/components/cart/CartNotes';
import CartCheckoutDialog from '@/components/cart/CartCheckoutDialog';
import CartEmpty from '@/components/cart/CartEmpty';
import CartError from '@/components/cart/CartError';
import CartSkeleton from '@/components/cart/CartSkeleton';

export default function Cart() {
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
    const [checkoutNotes, setCheckoutNotes] = useState('');

    const {
        cartItemsQuery,
        removeItemMutation,
        updateItemMutation,
        clearCartMutation,
        submitCartAsRequestMutation,
    } = useCartQueries();

    const cartItems = cartItemsQuery.data || [];
    const isLoading = cartItemsQuery.isLoading;
    const error = cartItemsQuery.error;

    // Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const updateItemQuantity = (itemId: number, newQuantity: number) => {
        // if (newQuantity <= 0) {
        //     removeItem(itemId);  // Mixing business logic & UI ❌
        //     return;
        // }

        updateItemMutation.mutate({ itemId, quantity: newQuantity });
    };

    const removeItem = (itemId: number) => {
        const item = cartItems.find(item => item.itemId === itemId);
        if (item) {
            removeItemMutation.mutate({ itemId, quantity: item.quantity });
        }
    };

    const handleClearCart = () => {
        clearCartMutation.mutate();
    };

    const handleSubmitRequest = () => {
        if (cartItems.length === 0) return;

        submitCartAsRequestMutation.mutate();
        setIsCheckoutDialogOpen(false);
        setCheckoutNotes('');
    };

    const handleRefreshCart = () => {
        cartItemsQuery.refetch();
    };

    const handleCheckout = () => {
        setIsCheckoutDialogOpen(true);
    };

    // Loading state
    if (isLoading) {
        return <CartSkeleton />;
    }

    // Error state
    if (error) {
        const apiError = formatApiError(error);
        const friendlyMessage = getFriendlyErrorMessage(apiError);
        
        return <CartError friendlyMessage={friendlyMessage} handleRefreshCart={handleRefreshCart} />;
    }

    // Empty cart state
    if (cartItems.length === 0) {
        return <CartEmpty />;
    }

    // Main cart view
    return (
        <div className="space-y-6">
            <CartHeader
                totalItems={totalItems}
                isLoading={isLoading}
                onRefresh={handleRefreshCart}
                onCheckout={handleCheckout}
                isSubmitting={submitCartAsRequestMutation.isPending}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CartTable
                        items={cartItems}
                        onUpdateQuantity={updateItemQuantity}
                        onRemoveItem={removeItem}
                        isUpdating={updateItemMutation.isPending}
                        isRemoving={removeItemMutation.isPending}
                    />
                </div>

                <div className="space-y-6">
                    <CartSummary
                        totalItems={totalItems}
                        uniqueItems={cartItems.length}
                    />

                    <CartActions
                        onClearCart={handleClearCart}
                        onRefreshCart={handleRefreshCart}
                        isClearing={clearCartMutation.isPending}
                        isRefreshing={isLoading}
                        hasItems={cartItems.length > 0}
                    />

                    <CartNotes />
                </div>
            </div>

            <CartCheckoutDialog
                isOpen={isCheckoutDialogOpen}
                onClose={() => setIsCheckoutDialogOpen(false)}
                onSubmit={handleSubmitRequest}
                items={cartItems}
                totalItems={totalItems}
                notes={checkoutNotes}
                onNotesChange={setCheckoutNotes}
                isSubmitting={submitCartAsRequestMutation.isPending}
            />
        </div>
    );
}