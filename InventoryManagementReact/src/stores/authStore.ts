import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { hasPermission as checkPermission, hasAnyPermission as checkAnyPermission, hasAllPermissions as checkAllPermissions } from '@/lib/auth-utils';
import { DEV_CONFIG } from '@/config/dev';
import type { Permission } from '@/types/permissions';

export interface AuthState {
    // User state
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    
    // Token state
    token: string | null;
    refreshToken: string | null;
    
    // Error state
    error: string | null;
}

export interface AuthActions {
    // User management
    setUser: (user: User | null) => void;
    clearUser: () => void;
    
    // Token management
    setTokens: (token: string, refreshToken: string) => void;
    clearTokens: () => void;
    
    // Error management
    setError: (error: string | null) => void;
    clearError: () => void;
    
    // Loading state
    setLoading: (loading: boolean) => void;
    
    // Auth state management
    login: (user: User, token: string, refreshToken: string) => void;
    loginWithGoogle: (googleToken: string) => Promise<void>;
    logout: () => void;
    
    // Permission methods
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
}

export type AuthStore = AuthState & AuthActions;

// Initial state
const initialState: AuthState = {
    user: DEV_CONFIG.BYPASS_AUTH ? {
        id: 1,
        email: DEV_CONFIG.DEFAULT_USER.email,
        firstName: DEV_CONFIG.DEFAULT_USER.firstName,
        lastName: DEV_CONFIG.DEFAULT_USER.lastName,
        fullName: DEV_CONFIG.DEFAULT_USER.firstName + ' ' + DEV_CONFIG.DEFAULT_USER.lastName, 
        role: { id: 1, name: DEV_CONFIG.DEFAULT_USER.role as 'ADMIN' | 'STOREKEEPER' | 'STAFF' },
        active: DEV_CONFIG.DEFAULT_USER.isActive,
    } : null,
    isAuthenticated: DEV_CONFIG.BYPASS_AUTH,
    isLoading: false,
    token: DEV_CONFIG.BYPASS_AUTH ? 'dev-token' : null,
    refreshToken: DEV_CONFIG.BYPASS_AUTH ? 'dev-refresh-token' : null,
    error: null,
};

// Auth store
export const useAuthStore = create<AuthStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Set user
            setUser: (user) => {
                set({ 
                    user, 
                    isAuthenticated: !!user 
                });
            },

            // Clear user
            clearUser: () => {
                set({ 
                    user: null, 
                    isAuthenticated: false 
                });
            },

            // Set tokens
            setTokens: (token, refreshToken) => {
                set({ token, refreshToken });
            },

            // Clear tokens
            clearTokens: () => {
                set({ token: null, refreshToken: null });
            },

            // Set error
            setError: (error) => {
                set({ error });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },

            // Set loading state
            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            // Login (set user and tokens)
            login: (user, token, refreshToken) => {
                set({
                    user,
                    token,
                    refreshToken,
                    isAuthenticated: true,
                    error: null,
                });
            },

            // Login with Google
            loginWithGoogle: async (googleToken: string) => {
                // This would typically call an API endpoint
                // For now, we'll just simulate a successful login
                const mockUser: User = {
                    id: 1,
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    fullName: 'Test User',
                    role: { id: 1, name: 'STAFF' },
                    active: true,
                };
                
                set({
                    user: mockUser,
                    token: 'mock-token',
                    refreshToken: 'mock-refresh-token',
                    isAuthenticated: true,
                    error: null,
                });
            },

            // Logout (clear everything)
            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Permission methods
            hasPermission: (permission: Permission) => {
                const state = get();
                return checkPermission(permission, state.user);
            },

            hasAnyPermission: (permissions: Permission[]) => {
                const state = get();
                return checkAnyPermission(permissions, state.user);
            },

            hasAllPermissions: (permissions: Permission[]) => {
                const state = get();
                return checkAllPermissions(permissions, state.user);
            },
        }),
        {
            name: 'auth-store',
        }
    )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthTokens = () => useAuthStore((state) => ({
    token: state.token,
    refreshToken: state.refreshToken,
    hasTokens: !!(state.token && state.refreshToken),
}));
