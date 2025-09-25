import { api, handleApiError } from './client';
import { formatShortDate, formatDate } from '@/utils/dateUtils';
import type {
    TransactionReportRequest,
    TransactionReport,
    TransactionDto,
} from '@/types/transactionReports';

// Transaction Report API functions based on Spring Boot TransactionReportController
export const transactionReportApi = {
    // Generate transaction report with filters
    generateReport: async (
        request: TransactionReportRequest
    ): Promise<TransactionReport> => {
        try {
            return await api.post<TransactionReport>(
                '/reports/transactions',
                request
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Export transaction report to CSV format
     * @param report - Transaction report data to export
     * @param filename - Optional filename
     */
    exportToCSV: (report: TransactionReport, filename?: string): void => {
        if (!report || report.transactions.length === 0) {
            throw new Error('No data to export');
        }

        // CSV headers
        const headers = [
            'Date',
            'Transaction Type',
            'Quantity',
            'Balance',
            'Supplier',
            'Invoice ID',
            'Receiver',
        ];

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...report.transactions.map((transaction) =>
                [
                    formatShortDate(transaction.date),
                    transaction.transactionType,
                    transaction.quantity,
                    transaction.balance,
                    transaction.supplier || '',
                    transaction.invoiceId || '',
                    transaction.receiver,
                ].join(',')
            ),
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            filename ||
                `transaction-report-${report.itemName.replace(/\s+/g, '-').toLowerCase()}-${formatShortDate(new Date().toISOString())}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Export detailed transaction report to CSV with summary
     * @param report - Transaction report data to export
     * @param filename - Optional filename
     */
    exportDetailedToCSV: (
        report: TransactionReport,
        filename?: string
    ): void => {
        if (!report || report.transactions.length === 0) {
            throw new Error('No data to export');
        }

        // Create detailed CSV content with summary
        const csvContent = [
            // Report header
            `Transaction Report for ${report.itemName}`,
            `Item ID: ${report.itemId}`,
            `Unit: ${report.unitOfMeasurement}`,
            `Generated: ${formatShortDate(new Date().toISOString())}`,
            '',
            // Summary section
            'SUMMARY',
            `Total Received,${report.totalReceived}`,
            `Total Issued,${report.totalIssued}`,
            `Net Change,${report.netChange}`,
            '',
            // Transaction details
            'TRANSACTION DETAILS',
            'Date,Transaction Type,Quantity,Balance,Supplier,Invoice ID,Receiver',
            ...report.transactions.map((transaction) =>
                [
                    formatShortDate(transaction.date),
                    transaction.transactionType,
                    transaction.quantity,
                    transaction.balance,
                    transaction.supplier || '',
                    transaction.invoiceId || '',
                    transaction.receiver,
                ].join(',')
            ),
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            filename ||
                `detailed-transaction-report-${report.itemName.replace(/\s+/g, '-').toLowerCase()}-${formatShortDate(new Date().toISOString())}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Calculate summary statistics from transaction report
     * @param report - Transaction report data
     * @returns Summary statistics
     */
    calculateSummaryStats: (report: TransactionReport) => {
        const receivedTransactions = report.transactions.filter(
            (t) => t.transactionType === 'IN'
        );
        const issuedTransactions = report.transactions.filter(
            (t) => t.transactionType === 'OUT'
        );

        return {
            totalTransactions: report.transactions.length,
            totalReceived: report.totalReceived,
            totalIssued: report.totalIssued,
            netChange: report.netChange,
            receivedTransactions: receivedTransactions.length,
            issuedTransactions: issuedTransactions.length,
            averageReceivedPerTransaction:
                receivedTransactions.length > 0
                    ? report.totalReceived / receivedTransactions.length
                    : 0,
            averageIssuedPerTransaction:
                issuedTransactions.length > 0
                    ? report.totalIssued / issuedTransactions.length
                    : 0,
        };
    },

    /**
     * Export transaction report to JSON format
     * @param report - Transaction report data to export
     * @param filename - Optional filename
     */
    exportToJSON: (report: TransactionReport, filename?: string): void => {
        if (!report || report.transactions.length === 0) {
            throw new Error('No data to export');
        }

        const exportData = {
            reportInfo: {
                itemId: report.itemId,
                itemName: report.itemName,
                unitOfMeasurement: report.unitOfMeasurement,
                generatedAt: new Date().toISOString(),
            },
            summary: {
                totalReceived: report.totalReceived,
                totalIssued: report.totalIssued,
                netChange: report.netChange,
            },
            transactions: report.transactions,
            statistics: transactionReportApi.calculateSummaryStats(report),
        };

        const jsonContent = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonContent], {
            type: 'application/json;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            filename ||
                `transaction-report-${report.itemName.replace(/\s+/g, '-').toLowerCase()}-${formatShortDate(new Date().toISOString())}.json`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Format transaction data for display in tables
     * @param transaction - Transaction data
     * @returns Formatted transaction data
     */
    formatTransactionForDisplay: (transaction: TransactionDto) => {
        return {
            ...transaction,
            formattedDate: formatShortDate(transaction.date),
            formattedDateTime: formatDate(transaction.date, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            formattedQuantity: transaction.quantity.toLocaleString(),
            formattedBalance: transaction.balance.toLocaleString(),
        };
    },
};
