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
    roleName: "STOREKEEPER"; 
}

export interface UserResponseDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    roleName: string;
    officeName?: string;
    departmentName?: string;
    active: boolean;
    createdAt?: string;
}