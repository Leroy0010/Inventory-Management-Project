import { ShoppingCart } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCart } from '@/hooks/queries/useCart';
import type { CartItem } from '@/types/cart';

export default function StaffShoppingCart() {
    const { hasPermission } = useAuthStore();
    const navigate = useNavigate();
    const canViewCart = hasPermission('VIEW_CART');
    const { data: cartItems = [], isLoading } = useCart(canViewCart);

    // Only show cart component for STAFF users
    if (!canViewCart) {
        return null;
    }

    const cartTotal = (cartItems as CartItem[]).reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Shopping Cart
                        </CardTitle>
                        <CardDescription>
                            Items ready for checkout
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/cart')}
                    >
                        View Cart
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {(cartItems as CartItem[]).length > 0 ? (
                        <>
                            {(cartItems as CartItem[]).map((item: CartItem) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-2 border rounded"
                                >
                                    <div>
                                        <p className="font-medium text-sm">
                                            {item.itemName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t pt-3 mt-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        Total Items:
                                    </span>
                                    <span className="font-bold text-lg">
                                        {cartTotal}
                                    </span>
                                </div>
                                <Button
                                    className="w-full mt-2"
                                    onClick={() => navigate('/cart')}
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Your cart is empty</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => navigate('/inventory-items')}
                            >
                                Browse Items
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
