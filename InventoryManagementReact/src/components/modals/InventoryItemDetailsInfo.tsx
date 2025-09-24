import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';

interface InventoryItemDetailsInfoProps {
    item: InventoryItemResponseDto;
    needsReorder: boolean;
}

export function InventoryItemDetailsInfo({
    item,
    needsReorder,
}: InventoryItemDetailsInfoProps) {
    return (
        <div className="space-y-6">
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
                            <Badge variant="destructive" className="text-xs">
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
                    value={item.description || 'No description available'}
                    readOnly
                    className="min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none"
                />
            </div>
        </div>
    );
}
