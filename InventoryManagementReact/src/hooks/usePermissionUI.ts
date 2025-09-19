import type { Permission } from "@/types/permissions";
import { usePermissionCheck } from "./usePermissionCheck";
import { useAuthStore } from "@/stores/authStore";

export function usePermissionUI(
    permissions: Permission[],
    requireAll: boolean = false
) {
    const { canAccess } = usePermissionCheck();
    const { user } = useAuthStore();

    return {
        hasAccess: canAccess(permissions, requireAll),
        userRole: user?.role,
        canShow: canAccess(permissions, requireAll),
        isAdmin: user?.role === 'ADMIN',
        isStorekeeper: user?.role === 'STOREKEEPER',
        isStaff: user?.role === 'STAFF',
    };
}