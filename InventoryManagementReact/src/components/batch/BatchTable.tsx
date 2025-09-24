import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, DollarSign, Hash } from 'lucide-react';
import type { InventoryBatch } from '@/types/inventoryBatch';

interface BatchTableProps {
    batches: InventoryBatch[];
    isLoading: boolean;
}

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GHS',
    }).format(amount);
};

export default function BatchTable({ batches, isLoading }: BatchTableProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>Batches</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-4"
                            >
                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Inventory Batches</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch ID</TableHead>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Remaining</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {batches.map((batch) => (
                            <TableRow key={batch.id}>
                                <TableCell>
                                    <Badge variant="outline">#{batch.id}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {batch.inventoryItemName}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-1">
                                        <Package className="h-3 w-3 text-muted-foreground" />
                                        <span>{batch.quantity}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            batch.remainingQuantity > 0
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {batch.remainingQuantity}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-1">
                                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                                        <span>
                                            {formatCurrency(batch.unitPrice)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-1">
                                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                                        <span className="font-medium">
                                            {formatCurrency(
                                                batch.unitPrice * batch.quantity
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {batch.supplierName ? (
                                        <span className="text-sm">
                                            {batch.supplierName}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            N/A
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {batch.invoiceId ? (
                                        <div className="flex items-center space-x-1">
                                            <Hash className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-sm font-mono">
                                                {batch.invoiceId}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            N/A
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm">
                                            {formatDate(batch.batchDate)}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
