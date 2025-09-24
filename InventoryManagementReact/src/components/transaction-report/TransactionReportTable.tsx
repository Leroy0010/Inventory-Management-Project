import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ChevronDown,
    ChevronRight,
    FileText,
    TrendingUp,
    TrendingDown,
    Download,
    FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
    TransactionReport,
    TransactionDto,
    StockTransactionType,
} from '@/types/transactionReports';
import { format } from 'date-fns';
import { transactionReportApi } from '@/api/transactionReport';
import { toast } from 'sonner';

// Date formatting functions using date-fns
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
};

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPP');
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'p');
};

interface TransactionReportTableProps {
    report: TransactionReport | null;
    isLoading?: boolean;
}

const getTransactionTypeBadge = (type: StockTransactionType) => {
    switch (type) {
        case 'IN':
            return (
                <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Received
                </Badge>
            );
        case 'OUT':
            return (
                <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800"
                >
                    <TrendingDown className="mr-1 h-3 w-3" />
                    Issued
                </Badge>
            );
        default:
            return <Badge variant="secondary">{type}</Badge>;
    }
};

const TransactionRow = ({ transaction }: { transaction: TransactionDto }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <TableRow
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                        {formatDate(transaction.date)}
                    </div>
                </TableCell>
                <TableCell>
                    {getTransactionTypeBadge(transaction.transactionType)}
                </TableCell>
                <TableCell className="text-right font-mono ">
                    {transaction.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono ">
                    {transaction.balance.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                    {transaction.supplier || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                    {transaction.invoiceId || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                    {transaction.receiver}
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow className="bg-muted/25">
                    <TableCell colSpan={7} className="p-0">
                        <div className="p-4 space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-muted-foreground">
                                        Date:
                                    </span>
                                    <span className="ml-2">
                                        {formatDateTime(transaction.date)}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">
                                        Time:
                                    </span>
                                    <span className="ml-2">
                                        {formatTime(transaction.date)}
                                    </span>
                                </div>
                                {transaction.supplier && (
                                    <div>
                                        <span className="font-medium text-muted-foreground">
                                            Supplier:
                                        </span>
                                        <span className="ml-2">
                                            {transaction.supplier}
                                        </span>
                                    </div>
                                )}
                                {transaction.invoiceId && (
                                    <div>
                                        <span className="font-medium text-muted-foreground">
                                            Invoice ID:
                                        </span>
                                        <span className="ml-2 font-mono">
                                            {transaction.invoiceId}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium text-muted-foreground">
                                        Receiver:
                                    </span>
                                    <span className="ml-2">
                                        {transaction.receiver}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">
                                        Balance:
                                    </span>
                                    <span className="ml-2 font-mono">
                                        {transaction.balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default function TransactionReportTable({
    report,
    isLoading,
}: TransactionReportTableProps) {
    const handleExportCSV = () => {
        if (!report) {
            toast.error('No data to export');
            return;
        }

        try {
            transactionReportApi.exportToCSV(report);
            toast.success('Transaction report exported successfully');
        } catch (error) {
            toast.error('Failed to export report');
            console.error('Export error:', error);
        }
    };

    const handleExportDetailedCSV = () => {
        if (!report) {
            toast.error('No data to export');
            return;
        }

        try {
            transactionReportApi.exportDetailedToCSV(report);
            toast.success('Detailed transaction report exported successfully');
        } catch (error) {
            toast.error('Failed to export detailed report');
            console.error('Export error:', error);
        }
    };

    const handleExportJSON = () => {
        if (!report) {
            toast.error('No data to export');
            return;
        }

        try {
            transactionReportApi.exportToJSON(report);
            toast.success('Transaction report exported as JSON successfully');
        } catch (error) {
            toast.error('Failed to export JSON report');
            console.error('Export error:', error);
        }
    };
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Transaction Report
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!report) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Transaction Report
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>
                            No report data available. Apply filters to generate
                            a report.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Transaction Report - {report.itemName}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            Unit: {report.unitOfMeasurement} | Item ID:{' '}
                            {report.itemId}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleExportCSV}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Export CSV (Simple)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleExportDetailedCSV}
                                >
                                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                                    Export CSV (Detailed)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportJSON}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Export JSON
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                Total Received
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {report.totalReceived.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                Total Issued
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                            {report.totalIssued.toLocaleString()}
                        </div>
                    </div>
                    <div
                        className={cn(
                            'p-4 rounded-lg',
                            report.netChange >= 0
                                ? 'bg-blue-50 dark:bg-blue-950'
                                : 'bg-orange-50 dark:bg-orange-950'
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <FileText
                                className={cn(
                                    'h-5 w-5',
                                    report.netChange >= 0
                                        ? 'text-blue-600'
                                        : 'text-orange-600'
                                )}
                            />
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    report.netChange >= 0
                                        ? 'text-blue-800 dark:text-blue-200'
                                        : 'text-orange-800 dark:text-orange-200'
                                )}
                            >
                                Net Change
                            </span>
                        </div>
                        <div
                            className={cn(
                                'text-2xl font-bold',
                                report.netChange >= 0
                                    ? 'text-blue-900 dark:text-blue-100'
                                    : 'text-orange-900 dark:text-orange-100'
                            )}
                        >
                            {report.netChange >= 0 ? '+' : ''}
                            {report.netChange.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                {report.transactions.length > 0 ? (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Balance
                                    </TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Invoice ID</TableHead>
                                    <TableHead>Receiver</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {report.transactions.map(
                                    (transaction, index) => (
                                        <TransactionRow
                                            key={index}
                                            transaction={transaction}
                                        />
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No transactions found for the selected criteria.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
