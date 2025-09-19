import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Package, ShoppingCart, Trash2 } from 'lucide-react';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';

interface InventoryListViewProps {
    items: InventoryItemResponseDto[];
    isStorekeeper: boolean;
    onEdit: (item: InventoryItemResponseDto) => void;
    onDelete: (item: InventoryItemResponseDto) => void;
    onAddToCart: (item: InventoryItemResponseDto) => void;
    onViewDetails: (item: InventoryItemResponseDto) => void;
}

export function InventoryListView({
    items,
    isStorekeeper,
    onEdit,
    onDelete,
    onAddToCart,
    onViewDetails,
}: InventoryListViewProps) {
    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.unit} • ID: {item.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary">ID: {item.id}</Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(item)}
                        >
                            View Details
                        </Button>
                        {isStorekeeper ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(item)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDelete(item)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <Button size="sm" onClick={() => onAddToCart(item)}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
