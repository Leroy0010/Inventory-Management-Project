import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle } from 'lucide-react';
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Item Image</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
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
                    </div>

                    {/* Reorder Warning Overlay */}
                    {needsReorder && (
                        <div className="absolute top-4 right-4">
                            <Badge variant="destructive" className="text-sm">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Low Stock
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
