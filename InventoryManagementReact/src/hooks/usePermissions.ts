import { useAuthStore } from '@/stores/authStore';
import type { Permission } from '@/types/permissions';

export function usePermissions() {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore();

    return { hasPermission, hasAnyPermission, hasAllPermissions };
}
