import { api, handleApiError } from './client';

export const stockTransactionApi = {
    // Stock Transactions
    getStockTransactions: async (): Promise<any[]> => {
        try {
            return await api.get<any[]>('/stock-transactions');
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
