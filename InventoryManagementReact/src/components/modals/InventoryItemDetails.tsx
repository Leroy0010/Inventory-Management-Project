import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
    X,
    Package,
    AlertTriangle,
    ExternalLink,
    Edit,
    Trash2,
    CheckCircle2,
    ShoppingCart,
    Minus,
} from 'lucide-react';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';
import { useCartQueries, useIsItemInCart } from '@/hooks/queries/useCart';
import { useAuthStore } from '@/stores/authStore';
import { InventoryItemDetailsHeader } from './InventoryItemDetailsHeader';
import { InventoryItemDetailsImage } from './InventoryItemDetailsImage';
import { InventoryItemDetailsInfo } from './InventoryItemDetailsInfo';
import { InventoryItemDetailsActions } from './InventoryItemDetailsActions';

interface InventoryItemDetailsProps {
    item: InventoryItemResponseDto | null;
    isOpen: boolean;
    onClose: () => void;
    isStorekeeperView?: boolean;
    onEdit?: (item: InventoryItemResponseDto) => void;
    onDelete?: (item: InventoryItemResponseDto) => void;
    onAddToCart?: (item: InventoryItemResponseDto) => void;
}

export default function InventoryItemDetails({
    item,
    isOpen,
    onClose,
    isStorekeeperView = false,
    onEdit,
    onDelete,
    onAddToCart,
}: InventoryItemDetailsProps) {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { addItemMutation, removeItemMutation } = useCartQueries(
        user?.role === 'STAFF'
    );
    const {
        isInCart,
        cartItem,
        isLoading: isCartLoading,
    } = useIsItemInCart(item?.id || 0, user?.role === 'STAFF');

    if (!item) return null;

    // Calculate reorder status
    const needsReorder = item.quantity <= item.reorderLevel;

    const handleToggleCart = () => {
        if (onAddToCart) {
            onAddToCart(item);
        } else {
            if (isInCart) {
                // Remove from cart
                removeItemMutation.mutate({
                    itemId: item.id,
                    quantity: cartItem?.quantity || 1,
                });
            } else {
                // Add to cart
                addItemMutation.mutate({ itemId: item.id, quantity: 1 });
            }
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(item);
        }
    };

    const handleViewFullScreen = () => {
        // Close the modal first
        onClose();
        // Navigate to the full page view
        navigate(`/inventory-items/${item.id}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <InventoryItemDetailsHeader onClose={onClose} />
                </DialogHeader>

                <div className="space-y-6">
                    <InventoryItemDetailsImage
                        item={item}
                        needsReorder={needsReorder}
                    />
                    <InventoryItemDetailsInfo
                        item={item}
                        needsReorder={needsReorder}
                    />
                    <InventoryItemDetailsActions
                        item={item}
                        isStorekeeperView={isStorekeeperView}
                        isInCart={isInCart}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddToCart={handleToggleCart}
                        onViewFullScreen={handleViewFullScreen}
                        isLoading={
                            addItemMutation.isPending ||
                            removeItemMutation.isPending ||
                            isCartLoading
                        }
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
