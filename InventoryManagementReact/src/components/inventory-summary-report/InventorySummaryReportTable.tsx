import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Package,
    TrendingUp,
    TrendingDown,
    Minus,
    AlertCircle,
} from 'lucide-react';
import type { InventorySummaryItemDto } from '@/types/inventorySummaryReport';

interface InventorySummaryReportTableProps {
    data: InventorySummaryItemDto[];
    isLoading?: boolean;
    error?: string | null;
    className?: string;
}

export default function InventorySummaryReportTable({
    data,
    isLoading = false,
    error = null,
    className,
}: InventorySummaryReportTableProps) {
    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>Report Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-4"
                            >
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-4 w-[80px]" />
                                <Skeleton className="h-4 w-[80px]" />
                                <Skeleton className="h-4 w-[80px]" />
                                <Skeleton className="h-4 w-[80px]" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>Report Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-destructive mb-2">
                                Error Loading Report
                            </h3>
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>Report Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No Data Available
                            </h3>
                            <p className="text-muted-foreground">
                                No inventory data found for the selected
                                criteria.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Determine if this is a quantity or value report
    // Check if quantity fields have actual values (not null/undefined)
    const isQuantityReport =
        data[0]?.quantityBroughtForward !== null &&
        data[0]?.quantityBroughtForward !== undefined;

    const formatNumber = (value: number | undefined) => {
        if (value === undefined || value === null) return '0';
        return value.toLocaleString();
    };

    const formatCurrency = (value: number | undefined) => {
        if (value === undefined || value === null) return '0.00';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const getChangeIcon = (broughtForward: number, carriedForward: number) => {
        if (carriedForward > broughtForward) {
            return <TrendingUp className="h-4 w-4 text-green-600" />;
        } else if (carriedForward < broughtForward) {
            return <TrendingDown className="h-4 w-4 text-red-600" />;
        } else {
            return <Minus className="h-4 w-4 text-gray-600" />;
        }
    };

    const getChangeColor = (broughtForward: number, carriedForward: number) => {
        if (carriedForward > broughtForward) {
            return 'text-green-600';
        } else if (carriedForward < broughtForward) {
            return 'text-red-600';
        } else {
            return 'text-gray-600';
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>
                        {isQuantityReport
                            ? 'Quantity Summary Report'
                            : 'Value Summary Report'}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">
                                    Inventory Item
                                </TableHead>
                                <TableHead className="w-[100px]">
                                    Unit
                                </TableHead>
                                <TableHead className="w-[120px] text-right">
                                    {isQuantityReport
                                        ? 'Brought Forward'
                                        : 'Value Brought Forward (GHS)'}
                                </TableHead>
                                <TableHead className="w-[120px] text-right">
                                    {isQuantityReport
                                        ? 'Received'
                                        : 'Value Received (GHS)'}
                                </TableHead>
                                <TableHead className="w-[120px] text-right">
                                    {isQuantityReport
                                        ? 'Issued'
                                        : 'Value Issued (GHS)'}
                                </TableHead>
                                <TableHead className="w-[120px] text-right">
                                    {isQuantityReport
                                        ? 'Carried Forward'
                                        : 'Value Carried Forward (GHS)'}
                                </TableHead>
                                <TableHead className="w-[100px] text-center">
                                    Change {!isQuantityReport && '(GHS)'}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => {
                                const broughtForward = isQuantityReport
                                    ? (item.quantityBroughtForward ?? 0)
                                    : (item.valueBroughtForward ?? 0);
                                const received = isQuantityReport
                                    ? (item.quantityReceived ?? 0)
                                    : (item.valueReceived ?? 0);
                                const issued = isQuantityReport
                                    ? (item.quantityIssued ?? 0)
                                    : (item.valueIssued ?? 0);
                                const carriedForward = isQuantityReport
                                    ? (item.quantityCarriedForward ?? 0)
                                    : (item.valueCarriedForward ?? 0);

                                return (
                                    <TableRow key={item.inventoryId || index}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {item.inventoryName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {item.inventoryId}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {item.unit}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {isQuantityReport
                                                ? formatNumber(broughtForward)
                                                : formatCurrency(
                                                      broughtForward
                                                  )}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {isQuantityReport
                                                ? formatNumber(received)
                                                : formatCurrency(received)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {isQuantityReport
                                                ? formatNumber(issued)
                                                : formatCurrency(issued)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            <div className="flex items-center justify-end space-x-2">
                                                <span
                                                    className={getChangeColor(
                                                        broughtForward,
                                                        carriedForward
                                                    )}
                                                >
                                                    {isQuantityReport
                                                        ? formatNumber(
                                                              carriedForward
                                                          )
                                                        : formatCurrency(
                                                              carriedForward
                                                          )}
                                                </span>
                                                {getChangeIcon(
                                                    broughtForward,
                                                    carriedForward
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center">
                                                <Badge
                                                    variant={
                                                        carriedForward >
                                                        broughtForward
                                                            ? 'default'
                                                            : carriedForward <
                                                                broughtForward
                                                              ? 'destructive'
                                                              : 'secondary'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {carriedForward >
                                                    broughtForward
                                                        ? '+'
                                                        : carriedForward <
                                                            broughtForward
                                                          ? '-'
                                                          : '='}
                                                    {isQuantityReport
                                                        ? Math.abs(
                                                              carriedForward -
                                                                  broughtForward
                                                          ).toLocaleString()
                                                        : Math.abs(
                                                              carriedForward -
                                                                  broughtForward
                                                          ).toFixed(2)}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
