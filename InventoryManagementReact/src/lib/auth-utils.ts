import type { Permission } from '@/types/permissions';
import type { Role, User } from '@/types/auth';
import { ROLE_PERMISSIONS } from '@/types/permissions';
import type { UserProfile } from '@/types/profile';

// Get user permissions from user object
function getUserPermissions(user: User | null): Permission[] {
    if (!user || !user.role) {
        return [];
    }

    // Map role name to permissions
    return ROLE_PERMISSIONS[user.role] || [];
}

// Permission utility functions
export function hasPermission(
    permission: Permission,
    user: User | null
): boolean {
    const userPermissions = getUserPermissions(user);
    return userPermissions.includes(permission);
}

export function hasAnyPermission(
    permissions: Permission[],
    user: User | null
): boolean {
    const userPermissions = getUserPermissions(user);
    return permissions.some((permission) =>
        userPermissions.includes(permission)
    );
}

export function hasAllPermissions(
    permissions: Permission[],
    user: User | null
): boolean {
    const userPermissions = getUserPermissions(user);
    return permissions.every((permission) =>
        userPermissions.includes(permission)
    );
}

export const userProfileToUser = (profile: UserProfile): User => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: `${profile.firstName} ${profile.lastName}`,
    role: profile.roleName as Role,
    active: profile.active,
    office: profile?.officeName,
    department: profile?.departmentName,
});
