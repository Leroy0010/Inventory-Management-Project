import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Edit,
    Trash2,
    ShoppingCart,
    X,
    Package,
    CheckCircle2,
    AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';
import { Badge } from '../ui/badge';

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
    const [isInCart, setIsInCart] = useState(false);

    if (!item) return null;

    // Calculate reorder status
    const needsReorder = item.quantity <= item.reorderLevel;

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(item);
            setIsInCart(true);
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Item Details
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Image Section */}
                    <div className="flex justify-center">
                        <div className="relative w-64 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            {item.imagePath ? (
                                <img
                                    src={item.imagePath}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-16 w-16 text-gray-400" />
                                </div>
                            )}

                            {/* Reorder Warning Overlay */}
                            {needsReorder && (
                                <div className="absolute top-2 right-2">
                                    <Badge
                                        variant="destructive"
                                        className="text-xs"
                                    >
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Low Stock
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ID */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                ID:
                            </label>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {item.id}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Name:
                            </label>
                            <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                                {item.name}
                            </div>
                        </div>

                        {/* Unit */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Unit:
                            </label>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {item.unit}
                            </div>
                        </div>

                        {/* Current Quantity */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Current Quantity:
                            </label>
                            <div className="flex items-center space-x-2">
                                <span
                                    className={cn(
                                        'text-sm font-bold',
                                        needsReorder
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-gray-900 dark:text-gray-100'
                                    )}
                                >
                                    {item.quantity}
                                </span>
                                {needsReorder && (
                                    <Badge
                                        variant="destructive"
                                        className="text-xs"
                                    >
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Low Stock
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Reorder Level */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Reorder Level:
                            </label>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {item.reorderLevel}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Description:
                        </label>
                        <Textarea
                            value={
                                item.description || 'No description available'
                            }
                            readOnly
                            className="min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {isStorekeeperView ? (
                            // Storekeeper Action Buttons
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleEdit}
                                    className="flex items-center space-x-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span>Edit</span>
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="flex items-center space-x-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                </Button>
                            </>
                        ) : (
                            // Staff Add to Cart Button
                            <Button
                                onClick={handleAddToCart}
                                disabled={isInCart}
                                className={cn(
                                    'flex items-center space-x-2',
                                    isInCart
                                        ? 'bg-green-600 hover:bg-green-600 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600'
                                )}
                            >
                                {isInCart ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>In Cart</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-4 w-4" />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
