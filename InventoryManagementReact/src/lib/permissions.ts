import { UserRole, Permission } from '@/types';

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        // Dashboard
        Permission.VIEW_DASHBOARD,

        // Common pages (all roles have access)
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,
        Permission.VIEW_NOTIFICATIONS,
        Permission.SEND_MESSAGES,
        Permission.VIEW_SETTINGS,
        Permission.EDIT_SETTINGS,

        // Admin-specific pages (to be implemented)
        Permission.VIEW_DEPARTMENTS,
        Permission.ADD_DEPARTMENT,
        Permission.EDIT_DEPARTMENT,
        Permission.DELETE_DEPARTMENT,
        Permission.ADD_STOREKEEPER,
        Permission.SEND_GENERAL_NOTIFICATION,
    ],
    [UserRole.STAFF]: [
        // Dashboard
        Permission.VIEW_DASHBOARD,

        // Common pages
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,
        Permission.VIEW_NOTIFICATIONS,
        Permission.SEND_MESSAGES,
        Permission.VIEW_SETTINGS,

        // Staff-specific permissions
        Permission.VIEW_INVENTORY,
        Permission.VIEW_INVENTORY_ITEM_DETAILS,
        Permission.VIEW_CART,
        Permission.ADD_TO_CART,
        Permission.REMOVE_FROM_CART,
        Permission.CHECKOUT_CART,
        Permission.VIEW_REQUESTS,
        Permission.VIEW_REQUEST_DETAILS,
    ],
    [UserRole.STOREKEEPER]: [
        // Dashboard
        Permission.VIEW_DASHBOARD,

        // Common pages
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,
        Permission.VIEW_NOTIFICATIONS,
        Permission.SEND_MESSAGES,
        Permission.SEND_GENERAL_NOTIFICATION,
        Permission.VIEW_SETTINGS,
        Permission.EDIT_SETTINGS,

        // Department-specific management
        Permission.VIEW_INVENTORY,
        Permission.ADD_INVENTORY,
        Permission.EDIT_INVENTORY,
        Permission.DELETE_INVENTORY,
        Permission.VIEW_INVENTORY_ITEM_DETAILS,
        Permission.VIEW_OFFICE,
        Permission.ADD_OFFICE,
        Permission.EDIT_OFFICE,
        Permission.DELETE_OFFICE,
        Permission.VIEW_STAFF,
        Permission.ADD_STAFF,
        Permission.EDIT_STAFF,
        Permission.DELETE_STAFF,
        Permission.VIEW_BATCH,
        Permission.ADD_BATCH,
        Permission.EDIT_BATCH,
        Permission.DELETE_BATCH,

        // Request management
        Permission.VIEW_REQUESTS,
        Permission.APPROVE_REQUESTS,
        Permission.REJECT_REQUESTS,
        Permission.MANAGE_REQUESTS,
        Permission.VIEW_REQUEST_DETAILS,

        // Reports
        Permission.VIEW_REPORTS,
        Permission.VIEW_TRANSACTION_REPORTS,
        Permission.VIEW_USER_REPORTS,
        Permission.VIEW_INVENTORY_SUMMARY_REPORTS,
        Permission.EXPORT_REPORTS,
    ],
};
