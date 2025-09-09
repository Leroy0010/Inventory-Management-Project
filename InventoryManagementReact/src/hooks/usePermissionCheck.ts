import { useAuth } from './useAuth';
import type { Permission } from '@/types';

// Hook for conditional rendering based on permissions
export function usePermissionCheck() {
    const { hasAnyPermission, hasAllPermissions } = useAuth();

    return {
        hasAnyPermission,
        hasAllPermissions,
        canAccess: (permissions: Permission[], requireAll = false) =>
            requireAll
                ? hasAllPermissions(permissions)
                : hasAnyPermission(permissions),
    };
}
