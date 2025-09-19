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
        await authApi.refresh();

        // Then fetch user profile
        const user = await authApi.getProfile();
        setUser(user);
      } catch {
        clearUser();
      } finally {
        setLoading(false);
        setHydrated();
      }
    };

    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
