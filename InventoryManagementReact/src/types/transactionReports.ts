export interface TransactionReportRequest {
    itemId?: number;
    year?: number;
    month?: number; // 1-12
    transactionType?: StockTransactionType;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
}

export interface TransactionReport {
    itemId: number;
    itemName: string;
    unitOfMeasurement: string;
    transactions: TransactionDto[];
    totalReceived: number;
    totalIssued: number;
    netChange: number; // Changed from netchange to match Spring Boot
}

export interface TransactionDto {
    date: string; // ISO date string
    transactionType: StockTransactionType;
    quantity: number;
    supplier?: string;
    invoiceId?: string;
    receiver: string;
    balance: number;
}

export type StockTransactionType = "RECEIVED" | "ISSUED";