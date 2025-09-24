export interface UserReportItemDto {
    itemId: number;
    itemName: string;
    unit: string;
    quantityReceived: number;
}

export interface UserReportRequest {
    userId?: number;
    year?: number;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
}

export interface UserReportFilters {
    userId?: number; // Filter by specific user ID
    year?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: 'itemId' | 'itemName' | 'quantityReceived';
    sortOrder?: 'asc' | 'desc';
}

export interface UserDetailsDto {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    officeName?: string;
}

export interface UserReportResponse {
    items: UserReportItemDto[];
    userDetails: UserDetailsDto;
    totalItems: number;
    totalQuantity: number;
}
