import { TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TransactionReport } from '@/types/transactionReports';

interface TransactionSummaryCardsProps {
    report: TransactionReport;
}

export function TransactionSummaryCards({
    report,
}: TransactionSummaryCardsProps) {
    return (
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
    );
}
