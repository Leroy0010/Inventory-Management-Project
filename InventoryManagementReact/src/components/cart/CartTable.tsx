import React from 'react';
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
import { Plus, Minus, Trash2, ShoppingCart, RefreshCw } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import type { CartItem } from '@/types/cart';

interface CartTableProps {
    items: CartItem[];
    onUpdateQuantity: (itemId: number, quantity: number) => void;
    onRemoveItem: (itemId: number) => void;
    isUpdating: boolean;
    isRemoving: boolean;
}

export default function CartTable({
    items,
    onUpdateQuantity,
    onRemoveItem,
    isUpdating,
    isRemoving,
}: CartTableProps) {
    const { hasPermission } = usePermissions();

    return (
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
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
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
                                                    onUpdateQuantity(item.itemId, item.quantity - 1)
                                                }
                                                disabled={isUpdating}
                                                aria-label={`Decrease quantity of ${item.itemName}`}
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
                                                    onUpdateQuantity(item.itemId, item.quantity + 1)
                                                }
                                                disabled={isUpdating}
                                                aria-label={`Increase quantity of ${item.itemName}`}
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
                                            onClick={() => onRemoveItem(item.itemId)}
                                            disabled={isRemoving}
                                            aria-label={`Remove ${item.itemName} from cart`}
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
    );
}
