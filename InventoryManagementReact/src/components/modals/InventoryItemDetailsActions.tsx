import { Button } from '@/components/ui/button';
import {
    Edit,
    Trash2,
    ShoppingCart,
    CheckCircle2,
    ExternalLink,
    Minus,
    RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';

interface InventoryItemDetailsActionsProps {
    item: InventoryItemResponseDto;
    isStorekeeperView: boolean;
    isInCart: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onAddToCart: () => void;
    onViewFullScreen: () => void;
    isLoading?: boolean;
}

export function InventoryItemDetailsActions({
    item,
    isStorekeeperView,
    isInCart,
    onEdit,
    onDelete,
    onAddToCart,
    onViewFullScreen,
    isLoading = false,
}: InventoryItemDetailsActionsProps) {
    return (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Full Screen Button - Always visible */}
            <Button
                variant="outline"
                onClick={onViewFullScreen}
                className="flex items-center space-x-2 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
            >
                <ExternalLink className="h-4 w-4" />
                <span>View Full Screen</span>
            </Button>

            {/* Role-specific Action Buttons */}
            <div className="flex items-center space-x-3">
                {isStorekeeperView ? (
                    // Storekeeper Action Buttons
                    <>
                        <Button
                            variant="outline"
                            onClick={onEdit}
                            className="flex items-center space-x-2"
                        >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onDelete}
                            className="flex items-center space-x-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </Button>
                    </>
                ) : (
                    // Staff Toggle Cart Button
                    <Button
                        onClick={onAddToCart}
                        disabled={isLoading}
                        className={cn(
                            'flex items-center space-x-2 transition-colors duration-200',
                            isInCart
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                        )}
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>
                                    {isInCart ? 'Removing...' : 'Adding...'}
                                </span>
                            </>
                        ) : isInCart ? (
                            <>
                                <Minus className="h-4 w-4" />
                                <span>Remove from Cart</span>
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
    );
}
