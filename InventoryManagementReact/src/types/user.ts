export interface CreateStaffDto {
    email: string;
    firstName: string;
    lastName: string;
    officeName: string;
}

export interface CreateStorekeeperDto {
    email: string;
    firstName: string;
    lastName: string;
    departmentName: string;
}

export interface UserResponseDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    officeName?: string;
    departmentName?: string;
    active: boolean;
}