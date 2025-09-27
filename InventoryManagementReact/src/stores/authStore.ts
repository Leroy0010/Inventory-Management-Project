import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Role, User } from '@/types/auth';
import type { UserProfile } from '@/types/profile';
import {
    hasPermission as checkPermission,
    hasAnyPermission as checkAnyPermission,
    hasAllPermissions as checkAllPermissions,
} from '@/lib/auth-utils';
import type { Permission } from '@/types/permissions';
import { userProfileToUser } from '@/lib/auth-utils';

// --- Auth store types ---
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshing: boolean;
    error: AuthError | null;
    isHydrated: boolean;
}

export type AuthError = { type: 'API' | 'REFRESH' | 'LOGIN'; message: string };

export interface AuthActions {
    setUser: (user: User | null) => void;
    setUserFromProfile: (profile: UserProfile) => void;
    clearUser: () => void;

    setError: (error: AuthError | null) => void;
    clearError: () => void;

    setLoading: (loading: boolean) => void;
    setIsRefreshing: (isRefreshing: boolean) => void;

    login: (user: User) => void;
    logout: () => void;

    setHydrated: () => void;

    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
}

export type AuthStore = AuthState & AuthActions;

// --- Initial state ---
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isRefreshing: false,
    error: null,
    isHydrated: false,
};

// --- Zustand store ---
export const useAuthStore = create<AuthStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setUserFromProfile: (profile) =>
                set({
                    user: userProfileToUser(profile),
                    isAuthenticated: true,
                }),
            clearUser: () => set({ user: null, isAuthenticated: false }),

            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            setLoading: (loading) => set({ isLoading: loading }),
            setIsRefreshing: (isRefreshing) => set({ isRefreshing }),

            setHydrated: () => set({ isHydrated: true }),

            login: (user) => set({ user, isAuthenticated: true, error: null }),
            logout: () =>
                set({ user: null, isAuthenticated: false, error: null }),

            hasPermission: (permission: Permission) =>
                checkPermission(permission, get().user),
            hasAnyPermission: (permissions: Permission[]) =>
                checkAnyPermission(permissions, get().user),
            hasAllPermissions: (permissions: Permission[]) =>
                checkAllPermissions(permissions, get().user),
        }),
        { name: 'auth-store' }
    )
);
