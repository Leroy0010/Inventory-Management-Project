import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { TransactionRow } from './TransactionRow';
import type { TransactionReport } from '@/types/transactionReports';

interface TransactionTableProps {
    report: TransactionReport;
}

export function TransactionTable({ report }: TransactionTableProps) {
    if (report.transactions.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found for the selected criteria.</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Receiver</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {report.transactions.map((transaction, index) => (
                        <TransactionRow key={index} transaction={transaction} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
