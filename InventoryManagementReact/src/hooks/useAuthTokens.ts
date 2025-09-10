import { useAuthStore } from '@/stores/authStore';

/**
 * Custom hook for managing authentication tokens
 * This hook provides access to token management methods from the auth store
 */
export function useAuthTokens() {
    const { token, refreshToken, setTokens, clearTokens } = useAuthStore();

    return {
        // Token state
        token,
        refreshToken,
        hasTokens: !!(token && refreshToken),

        // Token actions
        setTokens,
        clearTokens,

        // Helper methods
        getAuthHeader: () => (token ? `Bearer ${token}` : null),
        isTokenExpired: (tokenToCheck?: string) => {
            if (!tokenToCheck) return true;
            try {
                const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
                return Date.now() >= payload.exp * 1000;
            } catch {
                return true;
            }
        },
    };
}
