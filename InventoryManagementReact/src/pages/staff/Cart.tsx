import { useState } from 'react';
import { useCartQueries } from '@/hooks/queries/useCart';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';
import type { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import CartHeader from '@/components/cart/CartHeader';
import CartTable from '@/components/cart/CartTable';
import CartSummary from '@/components/cart/CartSummary';
import CartActions from '@/components/cart/CartActions';
import CartNotes from '@/components/cart/CartNotes';
import CartCheckoutDialog from '@/components/cart/CartCheckoutDialog';
import CartEmpty from '@/components/cart/CartEmpty';
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
    } = useCartQueries(true); // Always enabled for cart page

    const cartItems = (cartItemsQuery.data || []) as CartItem[];
    const isLoading = cartItemsQuery.isLoading;
    const error = cartItemsQuery.error;

    // Calculate totals
    const totalItems = cartItems.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
    );

    const updateItemQuantity = (itemId: number, newQuantity: number) => {
        updateItemMutation.mutate({ itemId, quantity: newQuantity });
    };

    const removeItem = (itemId: number) => {
        const item = cartItems.find((item: CartItem) => item.itemId === itemId);
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

    // Error state - show inline error with retry option
    if (error) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Cart Loading Failed
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Unable to load your cart. This might be a temporary
                        issue.
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button onClick={handleRefreshCart} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="default"
                        >
                            Refresh Page
                        </Button>
                    </div>
                </div>
            </div>
        );
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
