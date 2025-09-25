import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { StockTransactionType } from '@/types/transactionReports';

interface TransactionTypeBadgeProps {
    type: StockTransactionType;
}

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
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
}
