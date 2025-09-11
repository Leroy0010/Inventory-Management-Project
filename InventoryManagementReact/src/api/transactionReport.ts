import { api, handleApiError } from './client';
import type { TransactionReportRequest, TransactionReport } from '@/types/reports';

// Transaction Report API functions based on Spring Boot TransactionReportController
export const transactionReportApi = {
    // Generate transaction report with filters
    generateReport: async (request: TransactionReportRequest): Promise<TransactionReport> => {
        try {
            return await api.post<TransactionReport>('/api/reports/transactions', request);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

