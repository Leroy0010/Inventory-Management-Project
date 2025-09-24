import { Package, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';

interface InventoryItemDetailsImageProps {
    item: InventoryItemResponseDto;
    needsReorder: boolean;
}

export function InventoryItemDetailsImage({
    item,
    needsReorder,
}: InventoryItemDetailsImageProps) {
    return (
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
                        <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                        </Badge>
                    </div>
                )}
            </div>
        </div>
    );
}
