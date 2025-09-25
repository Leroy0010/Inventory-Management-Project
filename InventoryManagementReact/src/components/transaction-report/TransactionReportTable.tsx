import { Card, CardContent } from '@/components/ui/card';
import type { TransactionReport } from '@/types/transactionReports';
import { transactionReportApi } from '@/api/transactionReport';
import { toast } from 'sonner';
import { TransactionReportHeader } from './TransactionReportHeader';
import { TransactionSummaryCards } from './TransactionSummaryCards';
import { TransactionTable } from './TransactionTable';
import { TransactionReportLoading } from './TransactionReportLoading';
import { TransactionReportEmpty } from './TransactionReportEmpty';

interface TransactionReportTableProps {
    report: TransactionReport | null;
    isLoading?: boolean;
}

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
        return <TransactionReportLoading />;
    }

    if (!report) {
        return <TransactionReportEmpty />;
    }

    return (
        <Card>
            <TransactionReportHeader
                report={report}
                onExportCSV={handleExportCSV}
                onExportDetailedCSV={handleExportDetailedCSV}
                onExportJSON={handleExportJSON}
            />
            <CardContent>
                <TransactionSummaryCards report={report} />
                <TransactionTable report={report} />
            </CardContent>
        </Card>
    );
}
