import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Package,
    CheckCircle,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useCartQueries } from '@/hooks/queries/useCart';
import type { CartItem } from '@/types/cart';

export default function Cart() {
    const { hasPermission } = usePermissions();
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
    const [checkoutNotes, setCheckoutNotes] = useState('');

    const {
        cartItemsQuery,
        addItemMutation,
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
        if (newQuantity <= 0) {
            removeItem(itemId);
            return;
        }

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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Error Loading Cart
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {error.message}
                    </p>
                    <Button onClick={handleRefreshCart}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Shopping Cart
                    </h1>
                    <p className="text-muted-foreground">
                        Your cart is currently empty
                    </p>
                </div>

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No items in cart
                        </h3>
                        <p className="text-muted-foreground text-center mb-6">
                            Browse inventory items and add them to your cart to
                            make a request
                        </p>
                        <Button
                            onClick={() =>
                                (window.location.href = '/inventory-items')
                            }
                        >
                            <Package className="mr-2 h-4 w-4" />
                            Browse Inventory
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Shopping Cart
                    </h1>
                    <p className="text-muted-foreground">
                        Review your items before submitting a request
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="text-sm">
                        {totalItems} items
                    </Badge>
                    <Button
                        variant="outline"
                        onClick={handleRefreshCart}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    {hasPermission('CHECKOUT_CART') && (
                        <Dialog
                            open={isCheckoutDialogOpen}
                            onOpenChange={setIsCheckoutDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button disabled={submitCartAsRequestMutation.isPending}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Submit Request
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm Request</DialogTitle>
                                    <DialogDescription>
                                        Review your items and add any notes
                                        before submitting the request
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Items Summary</Label>
                                        <div className="max-h-40 overflow-y-auto space-y-2">
                                            {cartItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span>
                                                        {item.itemName} x {item.quantity}
                                                    </span>
                                                    <span>
                                                        {item.unit}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-semibold">
                                            <span>Total Items</span>
                                            <span>{totalItems}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="notes">
                                            Notes (Optional)
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            value={checkoutNotes}
                                            onChange={(e) =>
                                                setCheckoutNotes(e.target.value)
                                            }
                                            placeholder="Add any additional notes for this request..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setIsCheckoutDialogOpen(false)
                                        }
                                        disabled={submitCartAsRequestMutation.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleSubmitRequest}
                                        disabled={submitCartAsRequestMutation.isPending}
                                    >
                                        {submitCartAsRequestMutation.isPending ? (
                                            <>
                                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Request'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <ShoppingCart className="h-5 w-5" />
                                <span>Cart Items</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Item ID</TableHead>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {item.id}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {item.itemId}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {item.itemName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {item.unit}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {hasPermission('REMOVE_FROM_CART') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateItemQuantity(
                                                                    item.itemId,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            disabled={updateItemMutation.isPending}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <span className="w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    {hasPermission('ADD_TO_CART') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateItemQuantity(
                                                                    item.itemId,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            disabled={updateItemMutation.isPending}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {hasPermission('REMOVE_FROM_CART') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(item.itemId)}
                                                        disabled={removeItemMutation.isPending}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cart Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Total Items</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Unique Items</span>
                                <span>{cartItems.length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cart Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                onClick={handleClearCart}
                                disabled={clearCartMutation.isPending || cartItems.length === 0}
                                className="w-full"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {clearCartMutation.isPending ? 'Clearing...' : 'Clear Cart'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleRefreshCart}
                                disabled={isLoading}
                                className="w-full"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh Cart
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Important Notes</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>
                                • All requests require approval from your
                                supervisor
                            </p>
                            <p>
                                • Items will be delivered to your office
                                location
                            </p>
                            <p>
                                • You will be notified when your request is
                                approved or rejected
                            </p>
                            <p>
                                • Contact your storekeeper if you have any
                                questions
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
