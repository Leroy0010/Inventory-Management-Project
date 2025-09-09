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
    FileText,
    Download,
    Filter,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Package,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Transaction {
    id: string;
    type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
    itemName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    fromLocation?: string;
    toLocation?: string;
    reason: string;
    performedBy: string;
    timestamp: string;
    status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

interface TransactionSummary {
    totalTransactions: number;
    totalInValue: number;
    totalOutValue: number;
    netValue: number;
    topItems: Array<{
        itemName: string;
        totalQuantity: number;
        totalValue: number;
    }>;
}

export default function TransactionReport() {
    const { hasPermission } = usePermissions();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<TransactionSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        type: 'ALL',
        status: 'ALL',
    });

    // Mock data - replace with actual API calls
    useEffect(() => {
        const mockTransactions: Transaction[] = [
            {
                id: '1',
                type: 'IN',
                itemName: 'A4 Paper Sheets',
                sku: 'PAPER-A4-001',
                quantity: 100,
                unitPrice: 12.5,
                totalValue: 1250.0,
                toLocation: 'Main Office',
                reason: 'New stock delivery',
                performedBy: 'John Smith',
                timestamp: '2024-01-20T10:30:00Z',
                status: 'COMPLETED',
            },
            {
                id: '2',
                type: 'OUT',
                itemName: 'Blue Ballpoint Pens',
                sku: 'PEN-BLUE-001',
                quantity: 25,
                unitPrice: 1.25,
                totalValue: 31.25,
                fromLocation: 'Main Office',
                reason: 'Staff request fulfillment',
                performedBy: 'Jane Doe',
                timestamp: '2024-01-20T14:15:00Z',
                status: 'COMPLETED',
            },
            {
                id: '3',
                type: 'TRANSFER',
                itemName: 'Stapler',
                sku: 'STAPLER-001',
                quantity: 5,
                unitPrice: 25.0,
                totalValue: 125.0,
                fromLocation: 'Main Office',
                toLocation: 'Branch Office',
                reason: 'Office relocation',
                performedBy: 'Mike Johnson',
                timestamp: '2024-01-19T16:45:00Z',
                status: 'COMPLETED',
            },
            {
                id: '4',
                type: 'ADJUSTMENT',
                itemName: 'Notebooks',
                sku: 'NOTEBOOK-001',
                quantity: -10,
                unitPrice: 5.0,
                totalValue: -50.0,
                reason: 'Damaged goods disposal',
                performedBy: 'Sarah Wilson',
                timestamp: '2024-01-18T11:20:00Z',
                status: 'COMPLETED',
            },
        ];

        const mockSummary: TransactionSummary = {
            totalTransactions: 4,
            totalInValue: 1250.0,
            totalOutValue: 156.25,
            netValue: 1093.75,
            topItems: [
                {
                    itemName: 'A4 Paper Sheets',
                    totalQuantity: 100,
                    totalValue: 1250.0,
                },
                {
                    itemName: 'Blue Ballpoint Pens',
                    totalQuantity: 25,
                    totalValue: 31.25,
                },
                { itemName: 'Stapler', totalQuantity: 5, totalValue: 125.0 },
            ],
        };

        setTransactions(mockTransactions);
        setSummary(mockSummary);
        setLoading(false);
    }, []);

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesDate =
            (!filters.dateFrom || transaction.timestamp >= filters.dateFrom) &&
            (!filters.dateTo || transaction.timestamp <= filters.dateTo);
        const matchesType =
            filters.type === 'ALL' || transaction.type === filters.type;
        const matchesStatus =
            filters.status === 'ALL' || transaction.status === filters.status;

        return matchesDate && matchesType && matchesStatus;
    });

    const getTransactionTypeColor = (type: string) => {
        switch (type) {
            case 'IN':
                return 'bg-green-100 text-green-800';
            case 'OUT':
                return 'bg-red-100 text-red-800';
            case 'TRANSFER':
                return 'bg-blue-100 text-blue-800';
            case 'ADJUSTMENT':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTransactionTypeIcon = (type: string) => {
        switch (type) {
            case 'IN':
                return <TrendingUp className="h-3 w-3" />;
            case 'OUT':
                return <TrendingDown className="h-3 w-3" />;
            case 'TRANSFER':
                return <Package className="h-3 w-3" />;
            case 'ADJUSTMENT':
                return <FileText className="h-3 w-3" />;
            default:
                return null;
        }
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Exporting transaction report...');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!hasPermission('VIEW_TRANSACTION_REPORTS')) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive">
                        Access Denied
                    </h2>
                    <p className="text-muted-foreground">
                        You don't have permission to view transaction reports.
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
                        Transaction Report
                    </h1>
                    <p className="text-muted-foreground">
                        View and analyze inventory transaction history
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
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Transactions
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {summary.totalTransactions}
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
                                        Total In Value
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${summary.totalInValue.toFixed(2)}
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
                                        Total Out Value
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        ${summary.totalOutValue.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Net Value
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ${summary.netValue.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
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
                                Date From
                            </label>
                            <Input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        dateFrom: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Date To
                            </label>
                            <Input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        dateTo: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Transaction Type
                            </label>
                            <Select
                                value={filters.type}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, type: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Types
                                    </SelectItem>
                                    <SelectItem value="IN">Inbound</SelectItem>
                                    <SelectItem value="OUT">
                                        Outbound
                                    </SelectItem>
                                    <SelectItem value="TRANSFER">
                                        Transfer
                                    </SelectItem>
                                    <SelectItem value="ADJUSTMENT">
                                        Adjustment
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
                                    <SelectItem value="COMPLETED">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="PENDING">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total Value</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Performed By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Badge
                                            className={getTransactionTypeColor(
                                                transaction.type
                                            )}
                                        >
                                            <div className="flex items-center space-x-1">
                                                {getTransactionTypeIcon(
                                                    transaction.type
                                                )}
                                                <span>{transaction.type}</span>
                                            </div>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {transaction.itemName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {transaction.sku}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                transaction.quantity < 0
                                                    ? 'text-red-600'
                                                    : 'text-green-600'
                                            }
                                        >
                                            {transaction.quantity > 0
                                                ? '+'
                                                : ''}
                                            {transaction.quantity}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <DollarSign className="h-3 w-3" />
                                            <span>
                                                {transaction.unitPrice.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <DollarSign className="h-3 w-3" />
                                            <span
                                                className={
                                                    transaction.totalValue < 0
                                                        ? 'text-red-600'
                                                        : 'text-green-600'
                                                }
                                            >
                                                {transaction.totalValue.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {transaction.fromLocation && (
                                                <div>
                                                    From:{' '}
                                                    {transaction.fromLocation}
                                                </div>
                                            )}
                                            {transaction.toLocation && (
                                                <div>
                                                    To: {transaction.toLocation}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {transaction.performedBy}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {transaction.reason}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {new Date(
                                                    transaction.timestamp
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                transaction.status ===
                                                'COMPLETED'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {transaction.status}
                                        </Badge>
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
