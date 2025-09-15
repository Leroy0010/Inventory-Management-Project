export interface Office {
    id: number;
    name: string;
    location?: string;
    description?: string;
    staffCount: number;
}

export interface CreateOfficeRequest {
    name: string;
    location?: string;
    description?: string;
}

export interface UpdateOfficeRequest {
    id: number;
    name: string;
    location?: string;
    description?: string;
}

export interface OfficeFilters {
    search?: string;
}

export interface OfficeListResponse {
    offices: Office[];
    total: number;
    page: number;
    size: number;
}

// Legacy DTOs for backward compatibility
export interface CreateOfficeDto {
    name: string;
}

export interface OfficeResponseDto {
    id: number;
    name: string;
}