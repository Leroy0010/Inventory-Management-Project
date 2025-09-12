import type { Permission } from '@/types/permissions';
import type { User} from '@/types/auth';
import { DEV_CONFIG } from '@/config/dev';
import { ROLE_PERMISSIONS } from '@/types/permissions';

// Get user permissions from user object
function getUserPermissions(user: User | null): Permission[] {
    if (!user || !user.role) {
        return [];
    }
    
    // Map role name to permissions
    return ROLE_PERMISSIONS[user.role.name] || [];
}

// Permission utility functions
export function hasPermission(
    permission: Permission,
    user: User | null
): boolean {
    // In dev mode, bypass all permission checks
    if (DEV_CONFIG.BYPASS_PERMISSIONS) {
        return true;
    }
    
    const userPermissions = getUserPermissions(user);
    return userPermissions.includes(permission);
}

export function hasAnyPermission(
    permissions: Permission[],
    user: User | null
): boolean {
    // In dev mode, bypass all permission checks
    if (DEV_CONFIG.BYPASS_PERMISSIONS) {
        return true;
    }
    
    const userPermissions = getUserPermissions(user);
    return permissions.some((permission) =>
        userPermissions.includes(permission)
    );
}

export function hasAllPermissions(
    permissions: Permission[],
    user: User | null
): boolean {
    // In dev mode, bypass all permission checks
    if (DEV_CONFIG.BYPASS_PERMISSIONS) {
        return true;
    }
    
    const userPermissions = getUserPermissions(user);
    return permissions.every((permission) =>
        userPermissions.includes(permission)
    );
}
