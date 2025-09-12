import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Download,
    Filter,
    TrendingUp,
    Package,
    AlertTriangle,
    CheckCircle,
    DollarSign,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface InventorySummary {
    id: string;
    itemName: string;
    sku: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    unitPrice: number;
    totalValue: number;
    lastRestocked: string;
    lastIssued: string;
    status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCKED';
    location: string;
    supplier: string;
}

interface SummaryStats {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    overstockedItems: number;
    averageStockLevel: number;
    topCategories: Array<{
        category: string;
        itemCount: number;
        totalValue: number;
    }>;
}

export default function InventorySummaryReport() {
    const { hasPermission } = usePermissions();
    const [inventorySummary, setInventorySummary] = useState<
        InventorySummary[]
    >([]);
    const [stats, setStats] = useState<SummaryStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'ALL',
        status: 'ALL',
        location: 'ALL',
        search: '',
    });

    // Mock data - replace with actual API calls
    useEffect(() => {
        const mockInventorySummary: InventorySummary[] = [
            {
                id: '1',
                itemName: 'A4 Paper Sheets',
                sku: 'PAPER-A4-001',
                category: 'Office Supplies',
                currentStock: 150,
                minStock: 50,
                maxStock: 500,
                unitPrice: 12.5,
                totalValue: 1875.0,
                lastRestocked: '2024-01-15T10:30:00Z',
                lastIssued: '2024-01-20T14:15:00Z',
                status: 'IN_STOCK',
                location: 'Main Office - Storage A',
                supplier: 'Office Depot',
            },
            {
                id: '2',
                itemName: 'Blue Ballpoint Pens',
                sku: 'PEN-BLUE-001',
                category: 'Office Supplies',
                currentStock: 25,
                minStock: 100,
                maxStock: 1000,
                unitPrice: 1.25,
                totalValue: 31.25,
                lastRestocked: '2024-01-10T09:15:00Z',
                lastIssued: '2024-01-20T16:30:00Z',
                status: 'LOW_STOCK',
                location: 'Main Office - Storage B',
                supplier: 'Staples',
            },
            {
                id: '3',
                itemName: 'Stapler',
                sku: 'STAPLER-001',
                category: 'Office Equipment',
                currentStock: 0,
                minStock: 5,
                maxStock: 50,
                unitPrice: 25.0,
                totalValue: 0,
                lastRestocked: '2024-01-05T11:20:00Z',
                lastIssued: '2024-01-18T13:45:00Z',
                status: 'OUT_OF_STOCK',
                location: 'Main Office - Storage A',
                supplier: 'Office Depot',
            },
            {
                id: '4',
                itemName: 'Notebooks',
                sku: 'NOTEBOOK-001',
                category: 'Office Supplies',
                currentStock: 200,
                minStock: 50,
                maxStock: 100,
                unitPrice: 5.0,
                totalValue: 1000.0,
                lastRestocked: '2024-01-12T14:30:00Z',
                lastIssued: '2024-01-19T10:15:00Z',
                status: 'OVERSTOCKED',
                location: 'Branch Office - Storage',
                supplier: 'Amazon Business',
            },
        ];

        const mockStats: SummaryStats = {
            totalItems: 4,
            totalValue: 2906.25,
            lowStockItems: 1,
            outOfStockItems: 1,
            overstockedItems: 1,
            averageStockLevel: 93.75,
            topCategories: [
                {
                    category: 'Office Supplies',
                    itemCount: 3,
                    totalValue: 1906.25,
                },
                { category: 'Office Equipment', itemCount: 1, totalValue: 0 },
            ],
        };

        setInventorySummary(mockInventorySummary);
        setStats(mockStats);
        setLoading(false);
    }, []);

    const filteredInventorySummary = inventorySummary.filter((item) => {
        const matchesCategory =
            filters.category === 'ALL' || item.category === filters.category;
        const matchesStatus =
            filters.status === 'ALL' || item.status === filters.status;
        const matchesLocation =
            filters.location === 'ALL' ||
            item.location.includes(filters.location);
        const matchesSearch =
            filters.search === '' ||
            item.itemName
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
            item.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.category.toLowerCase().includes(filters.search.toLowerCase());

        return (
            matchesCategory && matchesStatus && matchesLocation && matchesSearch
        );
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'IN_STOCK':
                return 'bg-green-100 text-green-800';
            case 'LOW_STOCK':
                return 'bg-yellow-100 text-yellow-800';
            case 'OUT_OF_STOCK':
                return 'bg-red-100 text-red-800';
            case 'OVERSTOCKED':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'IN_STOCK':
                return <CheckCircle className="h-3 w-3" />;
            case 'LOW_STOCK':
                return <AlertTriangle className="h-3 w-3" />;
            case 'OUT_OF_STOCK':
                return <AlertTriangle className="h-3 w-3" />;
            case 'OVERSTOCKED':
                return <TrendingUp className="h-3 w-3" />;
            default:
                return null;
        }
    };

    const getStockLevelPercentage = (current: number, max: number) => {
        if (max === 0) return 0;
        return Math.min((current / max) * 100, 100);
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Exporting inventory summary report...');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!hasPermission('VIEW_INVENTORY_SUMMARY_REPORTS')) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive">
                        Access Denied
                    </h2>
                    <p className="text-muted-foreground">
                        You don't have permission to view inventory summary
                        reports.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Inventory Summary Report
                    </h1>
                    <p className="text-muted-foreground">
                        Comprehensive overview of inventory levels and status
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Items
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.totalItems}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Value
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${stats.totalValue.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Low Stock Items
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {stats.lowStockItems}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Avg Stock Level
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {stats.averageStockLevel}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Top Categories */}
            {stats && stats.topCategories.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5" />
                            <span>Top Categories</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {category.category}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {category.itemCount} items
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            ${category.totalValue.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Total Value
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Filter className="h-5 w-5" />
                        <span>Filters</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium">
                                Search
                            </label>
                            <Input
                                placeholder="Search items, SKU, or category..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        search: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Category
                            </label>
                            <Select
                                value={filters.category}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, category: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Categories
                                    </SelectItem>
                                    <SelectItem value="Office Supplies">
                                        Office Supplies
                                    </SelectItem>
                                    <SelectItem value="Office Equipment">
                                        Office Equipment
                                    </SelectItem>
                                    <SelectItem value="IT Equipment">
                                        IT Equipment
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Status
                            </label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, status: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="IN_STOCK">
                                        In Stock
                                    </SelectItem>
                                    <SelectItem value="LOW_STOCK">
                                        Low Stock
                                    </SelectItem>
                                    <SelectItem value="OUT_OF_STOCK">
                                        Out of Stock
                                    </SelectItem>
                                    <SelectItem value="OVERSTOCKED">
                                        Overstocked
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Location
                            </label>
                            <Select
                                value={filters.location}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, location: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Locations
                                    </SelectItem>
                                    <SelectItem value="Main Office">
                                        Main Office
                                    </SelectItem>
                                    <SelectItem value="Branch Office">
                                        Branch Office
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Inventory Summary Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total Value</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Last Activity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventorySummary.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {item.itemName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {item.sku}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {item.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Package className="h-3 w-3" />
                                            <span className="font-medium">
                                                {item.currentStock}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Min: {item.minStock} | Max:{' '}
                                            {item.maxStock}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    item.status === 'LOW_STOCK'
                                                        ? 'bg-yellow-500'
                                                        : item.status ===
                                                            'OUT_OF_STOCK'
                                                          ? 'bg-red-500'
                                                          : item.status ===
                                                              'OVERSTOCKED'
                                                            ? 'bg-blue-500'
                                                            : 'bg-green-500'
                                                }`}
                                                style={{
                                                    '--progress-width': `${getStockLevelPercentage(item.currentStock, item.maxStock)}%`,
                                                    width: 'var(--progress-width)',
                                                } as React.CSSProperties}
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {getStockLevelPercentage(
                                                item.currentStock,
                                                item.maxStock
                                            ).toFixed(1)}
                                            %
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={getStatusColor(
                                                item.status
                                            )}
                                        >
                                            <div className="flex items-center space-x-1">
                                                {getStatusIcon(item.status)}
                                                <span>
                                                    {item.status.replace(
                                                        '_',
                                                        ' '
                                                    )}
                                                </span>
                                            </div>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <DollarSign className="h-3 w-3" />
                                            <span>
                                                {item.unitPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1 font-medium">
                                            <DollarSign className="h-3 w-3" />
                                            <span>
                                                {item.totalValue.toFixed(2)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {item.location}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {item.supplier}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>
                                                Restocked:{' '}
                                                {new Date(
                                                    item.lastRestocked
                                                ).toLocaleDateString()}
                                            </div>
                                            <div className="text-muted-foreground">
                                                Issued:{' '}
                                                {new Date(
                                                    item.lastIssued
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
