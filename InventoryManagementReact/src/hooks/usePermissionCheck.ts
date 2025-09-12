import { useAuthStore } from '@/stores/authStore';
import type { Permission } from '@/types/permissions';

// Hook for conditional rendering based on permissions
export function usePermissionCheck() {
    const { hasAnyPermission, hasAllPermissions } = useAuthStore();

    return {
        hasAnyPermission,
        hasAllPermissions,
        canAccess: (permissions: Permission[], requireAll = false) =>
            requireAll
                ? hasAllPermissions(permissions)
                : hasAnyPermission(permissions),
    };
}
