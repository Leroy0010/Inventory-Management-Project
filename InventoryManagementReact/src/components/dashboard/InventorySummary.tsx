import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SkeletonCard } from '@/components/ui/skeleton';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { Package, AlertTriangle,  TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InventorySummaryProps {
    className?: string;
}

export function InventorySummary({ className }: InventorySummaryProps) {
    const { itemsQuery } = useInventoryItemQueries();

    // Calculate summary statistics
    const summary = React.useMemo(() => {
        if (!itemsQuery.data) return null;

        const totalItems = itemsQuery.data.length;
        const lowStockItems = itemsQuery.data.filter(
            (item) => item.reorderLevel <= 10
        ).length;

        return {
            totalItems,
            lowStockItems,
            lowStockPercentage:
                totalItems > 0
                    ? Math.round((lowStockItems / totalItems) * 100)
                    : 0,
        };
    }, [itemsQuery.data]);

    if (itemsQuery.isLoading) {
        return (
            <div className={className}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (itemsQuery.error) {
        return (
            <div className={className}>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">
                            Error loading inventory summary
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!summary) {
        return null;
    }

    return (
        <div className={className}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Items */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Items
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.totalItems}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total inventory items
                        </p>
                    </CardContent>
                </Card>

                {/* Low Stock Items */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Low Stock
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {summary.lowStockItems}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {summary.lowStockPercentage}% of total items
                        </p>
                    </CardContent>
                </Card>


                {/* Stock Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Stock Status
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.lowStockItems === 0 ? (
                                <Badge
                                    variant="default"
                                    className="bg-green-500"
                                >
                                    Good
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Attention</Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {summary.lowStockItems === 0
                                ? 'All items well stocked'
                                : 'Some items need restocking'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
