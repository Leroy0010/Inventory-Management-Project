import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';

interface CartActionsProps {
    onClearCart: () => void;
    onRefreshCart: () => void;
    isClearing: boolean;
    isRefreshing: boolean;
    hasItems: boolean;
}

export default function CartActions({
    onClearCart,
    onRefreshCart,
    isClearing,
    isRefreshing,
    hasItems,
}: CartActionsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cart Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button
                    variant="outline"
                    onClick={onClearCart}
                    disabled={isClearing || !hasItems}
                    className="w-full"
                    aria-label="Clear all items from cart"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isClearing ? 'Clearing...' : 'Clear Cart'}
                </Button>
                <Button
                    variant="outline"
                    onClick={onRefreshCart}
                    disabled={isRefreshing}
                    className="w-full"
                    aria-label="Refresh cart data"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh Cart
                </Button>
            </CardContent>
        </Card>
    );
}
