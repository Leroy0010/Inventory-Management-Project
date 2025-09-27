// useAuthInit.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';

export function useAuthInit() {
    const { setLoading, setUser, clearUser, setHydrated } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            try {
                // First try refresh (cookie → new session if still valid)
                const refreshUser = await authApi.refresh();
                setUser(refreshUser);
            } catch (refreshError) {
                console.log(
                    'Refresh failed, trying to get profile directly:',
                    refreshError
                );
                try {
                    // If refresh fails, try to get profile directly (in case we have a valid session)
                    const user = await authApi.getProfile();
                    setUser(user);
                } catch (profileError) {
                    console.log(
                        'Profile fetch also failed, clearing user:',
                        profileError
                    );
                    // Only clear user if it's not an OAuth callback scenario
                    const urlParams = new URLSearchParams(
                        window.location.search
                    );
                    const googleAuth = urlParams.get('google_auth');

                    if (googleAuth !== 'success') {
                        clearUser();
                    }
                }
            } finally {
                setLoading(false);
                setHydrated();
            }
        };

        initializeAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
