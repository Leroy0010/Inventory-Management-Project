export interface UserReportItemDto {
    inventoryCode: number; // Item ID
    inventoryName: string;
    unit: string;
    quantityReceived: number;
}

export interface UserReportRequest {
    userId?: number;
    year?: number;
    departmentId?: number; // For filtering by department
}

export interface UserReportFilters {
    search?: string; // Search by user name or email
    year?: number;
    departmentId?: number;
    sortBy?: 'inventoryName' | 'quantityReceived' | 'inventoryCode';
    sortOrder?: 'asc' | 'desc';
}

export interface UserReportSummary {
    userId: number;
    userName: string;
    userEmail: string;
    departmentName: string;
    totalItemsReceived: number;
    totalQuantityReceived: number;
    items: UserReportItemDto[];
}

export interface UserReportResponse {
    summaries: UserReportSummary[];
    totalUsers: number;
    totalItems: number;
    totalQuantity: number;
}
