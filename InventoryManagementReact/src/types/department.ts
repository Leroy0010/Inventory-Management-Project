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
    createdAt: string; // Backend returns LocalDate as string
    active: boolean;
    updatedAt: string; // Backend returns LocalDate as string
}
