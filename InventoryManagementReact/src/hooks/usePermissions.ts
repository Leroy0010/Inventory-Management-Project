import { useAuthStore } from '@/stores/authStore';
import { DEV_CONFIG } from '@/config/dev';
import type { Permission } from '@/types/permissions';

export function usePermissions() {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore();

    // In development mode, always return true for all permission checks
    if (DEV_CONFIG.BYPASS_PERMISSIONS) {
        return {
            hasPermission: (_permission: Permission) => true,
            hasAnyPermission: (_permissions: Permission[]) => true,
            hasAllPermissions: (_permissions: Permission[]) => true,
        };
    }

    return { hasPermission, hasAnyPermission, hasAllPermissions };
}
