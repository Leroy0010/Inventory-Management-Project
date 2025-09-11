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
import { ChevronDown, ChevronRight, Users, Package, TrendingUp, User } from 'lucide-react';
import type { UserReportSummary } from '@/types/userReport';

interface UserReportTableProps {
    data: UserReportSummary[] | null;
    isLoading?: boolean;
    searchTerm?: string;
}

const UserSummaryRow = ({ 
    summary, 
    isExpanded, 
    onToggle 
}: { 
    summary: UserReportSummary; 
    isExpanded: boolean; 
    onToggle: () => void;
}) => {
    return (
        <>
            <TableRow
                className="cursor-pointer hover:bg-muted/50 font-medium"
                onClick={onToggle}
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
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="font-medium">{summary.userName}</div>
                                <div className="text-sm text-muted-foreground">{summary.userEmail}</div>
                            </div>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{summary.officeName}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                    {summary.totalItemsReceived.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                    {summary.totalQuantityReceived.toLocaleString()}
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow className="bg-muted/25">
                    <TableCell colSpan={4} className="p-0">
                        <div className="p-4">
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground mb-3">
                                    Items Received by {summary.userName}
                                </h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">#</TableHead>
                                                <TableHead>Item Code</TableHead>
                                                <TableHead>Item Name</TableHead>
                                                <TableHead>Unit</TableHead>
                                                <TableHead className="text-right">Quantity</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {summary.items.map((item, index) => (
                                                <TableRow key={item.inventoryCode}>
                                                    <TableCell className="text-muted-foreground">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {item.inventoryCode}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {item.inventoryName}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{item.unit}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {item.quantityReceived.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default function UserReportTable({ data, isLoading, searchTerm }: UserReportTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (index: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedRows(newExpanded);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
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

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Report
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>
                            {searchTerm 
                                ? `No users found matching "${searchTerm}"` 
                                : 'No user data available. Apply filters to generate a report.'
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate totals
    const totalUsers = data.length;
    const totalItems = data.reduce((sum, user) => sum + user.totalItemsReceived, 0);
    const totalQuantity = data.reduce((sum, user) => sum + user.totalQuantityReceived, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Report
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                    Showing {totalUsers} users with {totalItems} total items and {totalQuantity.toLocaleString()} total quantity
                </div>
            </CardHeader>
            <CardContent>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Total Users
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {totalUsers.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                Total Items
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {totalItems.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                                Total Quantity
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {totalQuantity.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Office</TableHead>
                            <TableHead className="text-right">Items Received</TableHead>
                            <TableHead className="text-right">Total Quantity</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((summary, index) => (
                                <UserSummaryRow
                                    key={summary.userId}
                                    summary={summary}
                                    isExpanded={expandedRows.has(index)}
                                    onToggle={() => toggleRow(index)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
