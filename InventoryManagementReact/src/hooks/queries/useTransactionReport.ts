import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionReportApi } from '@/api/transactionReport';
import { toast } from 'sonner';
import { formatApiError, getFriendlyErrorMessage } from '@/lib/error-utils';
import type { TransactionReportRequest } from '@/types/reports';

// Query keys for transaction report operations
export const transactionReportKeys = {
    all: ['transaction-reports'] as const,
    report: (request: TransactionReportRequest) => [...transactionReportKeys.all, 'report', request] as const,
};

// Transaction Report queries and mutations
export const useTransactionReportQueries = () => {
    const queryClient = useQueryClient();

    // Generate transaction report mutation
    const generateReportMutation = useMutation({
        mutationFn: transactionReportApi.generateReport,
        onSuccess: (data) => {
            // Cache the report data
            queryClient.setQueryData(
                transactionReportKeys.report(data),
                data
            );
            toast.success('Transaction report generated successfully!');
        },
        onError: (error: unknown) => {
            const apiError = formatApiError(error);
            const friendlyMessage = getFriendlyErrorMessage(apiError);
            toast.error(`Failed to generate transaction report: ${friendlyMessage}`);
        },
    });

    return {
        // Mutations
        generateReportMutation,
    };
};
