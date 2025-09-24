import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Package,
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart3,
} from 'lucide-react';
import type { InventorySummaryStats } from '@/types/inventorySummaryReport';

interface InventorySummaryStatsProps {
    stats: InventorySummaryStats | undefined;
    isLoading?: boolean;
    isQuantityReport?: boolean;
    className?: string;
}

export default function InventorySummaryStats({
    stats,
    isLoading = false,
    isQuantityReport = true,
    className,
}: InventorySummaryStatsProps) {
    if (isLoading) {
        return (
            <div
                className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}
            >
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-6 w-[60px]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const formatNumber = (value: number) => {
        return value.toLocaleString();
    };

    const formatCurrency = (value: number) => {
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

    const totalBroughtForward = isQuantityReport
        ? stats.totalQuantityBroughtForward
        : stats.totalValueBroughtForward;
    const totalReceived = isQuantityReport
        ? stats.totalQuantityReceived
        : stats.totalValueReceived;
    const totalIssued = isQuantityReport
        ? stats.totalQuantityIssued
        : stats.totalValueIssued;
    const totalCarriedForward = isQuantityReport
        ? stats.totalQuantityCarriedForward
        : stats.totalValueCarriedForward;

    const netChange = totalCarriedForward - totalBroughtForward;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Items
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatNumber(stats.totalItems)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {isQuantityReport
                                        ? 'Brought Forward'
                                        : 'Value Brought Forward (GHS)'}
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {isQuantityReport
                                        ? formatNumber(totalBroughtForward)
                                        : formatCurrency(totalBroughtForward)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {isQuantityReport
                                        ? 'Total Received'
                                        : 'Total Value Received (GHS)'}
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {isQuantityReport
                                        ? formatNumber(totalReceived)
                                        : formatCurrency(totalReceived)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {isQuantityReport
                                        ? 'Total Issued'
                                        : 'Total Value Issued (GHS)'}
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {isQuantityReport
                                        ? formatNumber(totalIssued)
                                        : formatCurrency(totalIssued)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Net Change Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {isQuantityReport
                                            ? 'Net Change (Carried Forward)'
                                            : 'Net Value Change (GHS)'}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {isQuantityReport
                                            ? formatNumber(totalCarriedForward)
                                            : formatCurrency(
                                                  totalCarriedForward
                                              )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getChangeIcon(
                                    totalBroughtForward,
                                    totalCarriedForward
                                )}
                                <span
                                    className={`text-sm font-medium ${getChangeColor(totalBroughtForward, totalCarriedForward)}`}
                                >
                                    {netChange > 0
                                        ? '+'
                                        : netChange < 0
                                          ? ''
                                          : ''}
                                    {isQuantityReport
                                        ? formatNumber(Math.abs(netChange))
                                        : formatCurrency(Math.abs(netChange))}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Detailed Breakdown</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                {isQuantityReport
                                    ? 'Quantity Summary'
                                    : 'Value Summary'}
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">
                                        Brought Forward:
                                    </span>
                                    <span className="font-mono text-sm">
                                        {isQuantityReport
                                            ? formatNumber(totalBroughtForward)
                                            : formatCurrency(
                                                  totalBroughtForward
                                              )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Received:</span>
                                    <span className="font-mono text-sm text-green-600">
                                        {isQuantityReport
                                            ? formatNumber(totalReceived)
                                            : formatCurrency(totalReceived)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Issued:</span>
                                    <span className="font-mono text-sm text-red-600">
                                        {isQuantityReport
                                            ? formatNumber(totalIssued)
                                            : formatCurrency(totalIssued)}
                                    </span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center font-semibold">
                                        <span>Carried Forward:</span>
                                        <span
                                            className={`font-mono ${getChangeColor(totalBroughtForward, totalCarriedForward)}`}
                                        >
                                            {isQuantityReport
                                                ? formatNumber(
                                                      totalCarriedForward
                                                  )
                                                : formatCurrency(
                                                      totalCarriedForward
                                                  )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Calculations
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">
                                        Net Movement:
                                    </span>
                                    <span
                                        className={`font-mono text-sm ${getChangeColor(totalBroughtForward, totalCarriedForward)}`}
                                    >
                                        {isQuantityReport
                                            ? formatNumber(netChange)
                                            : formatCurrency(netChange)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Movement %:</span>
                                    <span
                                        className={`font-mono text-sm ${getChangeColor(totalBroughtForward, totalCarriedForward)}`}
                                    >
                                        {totalBroughtForward > 0
                                            ? `${((netChange / totalBroughtForward) * 100).toFixed(1)}%`
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Issued %:</span>
                                    <span className="font-mono text-sm text-red-600">
                                        {totalBroughtForward + totalReceived > 0
                                            ? `${((totalIssued / (totalBroughtForward + totalReceived)) * 100).toFixed(1)}%`
                                            : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    );
}
