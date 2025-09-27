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
    lastName?: string;
    fullName?: string;
    role: Role;
    office?: string;
    department?: string;
    active?: boolean;
}

export type Role = 'ADMIN' | 'STOREKEEPER' | 'STAFF';

export interface LoginResponse {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
}

export interface RefreshResponse {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
}

export interface TwoFactorAuthResponse {
    success: boolean;
    message: string;
    requiresTwoFactor: boolean;
    token?: string;
}
