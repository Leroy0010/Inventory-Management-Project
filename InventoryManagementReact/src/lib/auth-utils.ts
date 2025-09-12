import type { Permission } from '@/types';
import { DEV_CONFIG } from '@/config/dev';

// Permission utility functions
export function hasPermission(
    userPermissions: Permission[],
    permission: Permission
): boolean {
    // In dev mode, bypass all permission checks
    if (DEV_CONFIG.BYPASS_PERMISSIONS) {
        return true;
    }
    return userPermissions.includes(permission);
}

export function hasAnyPermission(
    userPermissions: Permission[],
    permissions: Permission[]
): boolean {
    // In dev mode, bypass all permission checks
    if (DEV_CONFIG.BYPASS_PERMISSIONS) {
        return true;
    }
    return permissions.some((permission) =>
        userPermissions.includes(permission)
    );
}

export function hasAllPermissions(
    userPermissions: Permission[],
    permissions: Permission[]
): boolean {
    // In dev mode, bypass all permission checks
    if (DEV_CONFIG.BYPASS_PERMISSIONS) {
        return true;
    }
    return permissions.every((permission) =>
        userPermissions.includes(permission)
    );
}
