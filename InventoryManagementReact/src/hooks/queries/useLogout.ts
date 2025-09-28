import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export function useLogout() {
    const queryClient = useQueryClient();
    const { clearUser, logout } = useAuthStore();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearUser();
            logout();
            queryClient.clear();
        },
        onError: () => {
            // Even if logout fails on server, clear local state
            clearUser();
            logout();
            queryClient.clear();
        },
    });
}
