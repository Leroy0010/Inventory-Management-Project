import { useState } from 'react';
import { useTransactionReportQueries } from '@/hooks/queries/useTransactionReport';
import TransactionReportFilters from '@/components/transaction-report/TransactionReportFilters';
import TransactionReportTable from '@/components/transaction-report/TransactionReportTable';
import type { TransactionReportRequest, TransactionReport } from '@/types/reports';

export default function TransactionReport() {
    const [report, setReport] = useState<TransactionReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { generateReportMutation } = useTransactionReportQueries();

    const handleApplyFilters = async (filters: TransactionReportRequest) => {
        setIsLoading(true);
        try {
            const result = await generateReportMutation.mutateAsync(filters);
            setReport(result);
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearFilters = () => {
        setReport(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transaction Report</h1>
                    <p className="text-muted-foreground">
                        Generate detailed transaction reports for inventory items
                    </p>
                </div>
            </div>

            <TransactionReportFilters
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isLoading={isLoading}
            />

            <TransactionReportTable
                report={report}
                isLoading={isLoading}
            />
        </div>
    );
}