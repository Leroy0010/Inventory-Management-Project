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
import { Package, TrendingUp, User, Download, FileText } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { userReportApi } from '@/api/userReport';
import { toast } from 'sonner';
import type { UserReportResponse, UserReportItemDto } from '@/types/userReport';

interface SingleUserReportTableProps {
    data: UserReportResponse | null;
    isLoading?: boolean;
}

export default function SingleUserReportTable({
    data,
    isLoading,
}: SingleUserReportTableProps) {
    const handleExportCSV = () => {
        if (!data) {
            toast.error('No data to export');
            return;
        }

        try {
            userReportApi.exportToCSV(data);
            toast.success('User report exported successfully');
        } catch (error) {
            toast.error('Failed to export report');
            console.error('Export error:', error);
        }
    };

    const handleExportDetailedCSV = () => {
        if (!data) {
            toast.error('No data to export');
            return;
        }

        try {
            userReportApi.exportDetailedToCSV(data);
            toast.success('Detailed user report exported successfully');
        } catch (error) {
            toast.error('Failed to export detailed report');
            console.error('Export error:', error);
        }
    };
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        User Report
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

    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        User Report
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            No report data available
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { userDetails, items, totalItems, totalQuantity } = data;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        User Report
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportCSV}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportDetailedCSV}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export Detailed CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="text-sm text-muted-foreground">
                    Report for {userDetails.fullName} - {totalItems} items,{' '}
                    {totalQuantity.toLocaleString()} total quantity
                </div>
            </CardHeader>
            <CardContent>
                {/* User Details Card */}
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        User Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Name:
                            </span>
                            <p className="font-medium">
                                {userDetails.fullName}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Email:
                            </span>
                            <p className="font-medium">{userDetails.email}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                ID:
                            </span>
                            <p className="font-medium font-mono">
                                {userDetails.id}
                            </p>
                        </div>
                        {userDetails.phone && (
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    Phone:
                                </span>
                                <p className="font-medium">
                                    {userDetails.phone}
                                </p>
                            </div>
                        )}
                        {userDetails.officeName && (
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    Office:
                                </span>
                                <p className="font-medium">
                                    {userDetails.officeName}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Total Items
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {totalItems.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                Total Quantity
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {totalQuantity.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                {items.length > 0 ? (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Item ID</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead className="text-right">
                                        Quantity Received
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={item.itemId}>
                                        <TableCell className="text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {item.itemId}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {item.itemName}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {item.unit}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {item.quantityReceived.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            No items found for this user
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
