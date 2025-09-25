import { useState } from 'react';
import { formatDate } from '@/utils/dateUtils';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TransactionTypeBadge } from './TransactionTypeBadge';
import type { TransactionDto } from '@/types/transactionReports';

interface TransactionRowProps {
    transaction: TransactionDto;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
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
                        {formatDate(transaction.date, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                </TableCell>
                <TableCell>
                    <TransactionTypeBadge type={transaction.transactionType} />
                </TableCell>
                <TableCell className="text-right font-mono">
                    {transaction.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
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
                                        {formatDate(transaction.date, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-muted-foreground">
                                        Time:
                                    </span>
                                    <span className="ml-2">
                                        {formatDate(transaction.date, {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
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
}
