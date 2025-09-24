import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';

interface InventoryItemDetailsInfoProps {
    item: InventoryItemResponseDto;
    currentQuantity: number;
    needsReorder: boolean;
}

export function InventoryItemDetailsInfo({
    item,
    currentQuantity,
    needsReorder,
}: InventoryItemDetailsInfoProps) {
    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Item ID
                            </label>
                            <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                                {item.id}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Unit
                            </label>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                {item.unit}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stock Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Stock Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Current Quantity
                            </label>
                            <div className="flex items-center space-x-2 mt-1">
                                <span
                                    className={cn(
                                        'text-2xl font-bold',
                                        needsReorder
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-gray-900 dark:text-gray-100'
                                    )}
                                >
                                    {currentQuantity}
                                </span>
                                {needsReorder && (
                                    <Badge variant="destructive">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Low Stock
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Reorder Level
                            </label>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {item.reorderLevel}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Description */}
            <Card>
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={item.description || 'No description available'}
                        readOnly
                        className="min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
