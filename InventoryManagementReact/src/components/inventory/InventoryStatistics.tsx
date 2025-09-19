import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Package } from 'lucide-react';

interface InventoryStatisticsProps {
    stats: {
        total: number;
        lowStock: number;
        inStock: number;
    };
}

export function InventoryStatistics({ stats }: InventoryStatisticsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Items
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.total}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                In Stock
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.inStock}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Low Stock
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.lowStock}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
