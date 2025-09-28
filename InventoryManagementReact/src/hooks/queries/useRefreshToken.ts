import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export function useRefreshToken() {
    const { setUser, clearError, clearUser } = useAuthStore();

    return useMutation({
        mutationFn: authApi.refresh,
        onSuccess: (data) => {
            if (data) {
                setUser({
                    id: data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    fullName: data.fullName,
                    role: data.role,
                });
            }
            clearError();
        },
        onError: () => {
            clearUser();
        },
    });
}
