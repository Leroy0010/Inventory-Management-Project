export interface Department {
    id: number;
    name: string;
    description?: string;
}

export interface DepartmentResponseDto {
    id: number;
    name: string;
    headOfDepartment?: string;
    description?: string;
    staffCount: number;
    createdAt: string; // ISO string from LocalDateTime
    active: boolean;
    updatedAt: string; // ISO string from LocalDateTime
}
