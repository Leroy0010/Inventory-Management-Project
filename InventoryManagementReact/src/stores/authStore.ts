import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { User } from '@/types/auth';




export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
    token: string | null;
    refreshToken: string | null;
}

export interface AuthActions {
    // User management
    setUser: (user: User | null) => void;
    updateUser: (updates: Partial<User>) => void;
    clearUser: () => void;

    // Token management
    setTokens: (token: string, refreshToken: string) => void;
    clearTokens: () => void;

    // Error management
    setError: (error: string | null) => void;
    clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

// Initial state
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    error: null,
    token: null,
    refreshToken: null,
};

// Auth store - simplified to work with TanStack Query
export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Set user and mark as authenticated
                setUser: (user: User | null) => {
                    set({ user, isAuthenticated: !!user, error: null });
                },

                // Update user data
                updateUser: (updates: Partial<User>) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({ user: { ...currentUser, ...updates } });
                    }
                },

                // Clear user and mark as unauthenticated
                clearUser: () => {
                    set({ user: null, isAuthenticated: false, error: null });
                },

                // Set tokens
                setTokens: (token: string, refreshToken: string) => {
                    set({ token, refreshToken });
                },

                // Clear tokens
                clearTokens: () => {
                    set({ token: null, refreshToken: null });
                },

                // Set error
                setError: (error: string | null) => {
                    set({ error });
                },

                // Clear error
                clearError: () => {
                    set({ error: null });
                },
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                    token: state.token,
                    refreshToken: state.refreshToken,
                }),
            }
        ),
        {
            name: 'auth-store',
        }
    )
);
