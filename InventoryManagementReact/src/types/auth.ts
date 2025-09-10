import type { Office } from './office';
import type { Department } from './department';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface GoogleLoginRequest {
    token: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: Role;
    office: Office;
    department?: Department;
    // active: boolean;
}

export interface Role {
    id: number;
    name: 'ADMIN' | 'STOREKEEPER' | 'STAFF';
    description?: string;
}

export interface LoginResponse {
    user: User;
    message: string;
}

export interface RefreshResponse {
    user: User;
    message: string;
}
