export interface UserReportItemDto {
    inventoryCode: number; // Item ID
    inventoryName: string;
    unit: string;
    quantityReceived: number;
}

export interface UserReportRequest {
    userId?: number;
    year?: number;
}

export interface UserReportFilters {
    search?: string; // Search by user name or email
    year?: number;
    sortBy?: 'userName' | 'quantityReceived' | 'inventoryCode';
    sortOrder?: 'asc' | 'desc';
}

export interface UserReportSummary {
    userId: number;
    userName: string;
    userEmail: string;
    officeName: string; // Changed from departmentName to officeName
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
