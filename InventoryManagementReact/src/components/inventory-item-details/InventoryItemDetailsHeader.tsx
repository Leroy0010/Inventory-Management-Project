import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Edit,
    Trash2,
    ShoppingCart,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';

interface InventoryItemDetailsHeaderProps {
    item: InventoryItemResponseDto;
    isStorekeeper: boolean;
    isInCart: boolean;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onAddToCart: () => void;
    isDeleting: boolean;
}

export function InventoryItemDetailsHeader({
    item,
    isStorekeeper,
    isInCart,
    onBack,
    onEdit,
    onDelete,
    onAddToCart,
    isDeleting,
}: InventoryItemDetailsHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {item.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Inventory Item Details
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
                {isStorekeeper ? (
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
                            disabled={isDeleting}
                            className="flex items-center space-x-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={onAddToCart}
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
    );
}
