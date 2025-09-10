import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Edit,
    Trash2,
    ShoppingCart,
    Eye,
    Package,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';

interface InventoryItemCardProps {
    item: InventoryItemResponseDto;
    isStorekeeperView?: boolean;
    onEdit?: (item: InventoryItemResponseDto) => void;
    onDelete?: (item: InventoryItemResponseDto) => void;
    onAddToCart?: (item: InventoryItemResponseDto) => void;
    onViewDetails?: (item: InventoryItemResponseDto) => void;
    className?: string;
}

export default function InventoryItemCard({
    item,
    isStorekeeperView = false,
    onEdit,
    onDelete,
    onAddToCart,
    onViewDetails,
    className,
}: InventoryItemCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    const needsReorder = item.quantity <= item.reorderLevel;

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(item);
            setIsInCart(true);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(item);
        }
    };

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(item);
        }
    };

    return (
        <Card
            className={cn(
                'group relative overflow-hidden transition-all duration-300 ease-in-out',
                'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]',
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                'max-w-[270px] min-h-[400px] flex flex-col',
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative p-4 pb-2">
                <div className="relative w-full h-[140px] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {item.imagePath ? (
                        <img
                            src={item.imagePath}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-400" />
                        </div>
                    )}

                    {/* Reorder Warning Overlay */}
                    {needsReorder && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Low Stock
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <CardContent className="flex-1 flex flex-col p-4 pt-2">
                {/* Item ID */}
                <div className="text-center mb-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                        ID: {item.id}
                    </Badge>
                </div>

                {/* Item Name */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center mb-1 line-clamp-2">
                    {item.name}
                </h3>

                {/* Unit */}
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center italic mb-3">
                    {item.unit}
                </p>

                {/* Storekeeper Fields */}
                {isStorekeeperView && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                                <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                    Qty:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="text-gray-300 dark:text-gray-600">
                                |
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                    Reorder:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                    {item.reorderLevel}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Details Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewDetails}
                    className="w-full mb-3 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                </Button>

                {/* Action Buttons */}
                <div className="mt-auto">
                    {isStorekeeperView ? (
                        // Storekeeper Action Buttons
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                size="sm"
                                onClick={handleEdit}
                                className="h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white p-0"
                                title="Edit Item"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleDelete}
                                className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                                title="Delete Item"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        // Staff Add to Cart Button
                        <Button
                            onClick={handleAddToCart}
                            disabled={isInCart}
                            className={cn(
                                'w-full',
                                isInCart
                                    ? 'bg-green-600 hover:bg-green-600 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                            )}
                        >
                            {isInCart ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    In Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>

            {/* Hover Effect Overlay */}
            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            )}
        </Card>
    );
}
