import { UserRole, Permission } from '@/types';

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: Object.values(Permission),
    [UserRole.STAFF]: [
        // Dashboard
        Permission.VIEW_DASHBOARD,

        // Inventory (view only)
        Permission.VIEW_INVENTORY,
        Permission.VIEW_INVENTORY_ITEM_DETAILS,

        // Cart functionality
        Permission.VIEW_CART,
        Permission.ADD_TO_CART,
        Permission.REMOVE_FROM_CART,
        Permission.CHECKOUT_CART,

        // Requests (view and create)
        Permission.VIEW_REQUESTS,
        Permission.VIEW_REQUEST_DETAILS,

        // Notifications
        Permission.VIEW_NOTIFICATIONS,
        Permission.SEND_MESSAGES,

        // Profile
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,

        // Settings
        Permission.VIEW_SETTINGS,
    ],
    [UserRole.STOREKEEPER]: [
        // Dashboard
        Permission.VIEW_DASHBOARD,

        // Inventory Management
        Permission.VIEW_INVENTORY,
        Permission.ADD_INVENTORY,
        Permission.EDIT_INVENTORY,
        Permission.DELETE_INVENTORY,
        Permission.VIEW_INVENTORY_ITEM_DETAILS,

        // Office Management
        Permission.VIEW_OFFICE,
        Permission.ADD_OFFICE,
        Permission.EDIT_OFFICE,
        Permission.DELETE_OFFICE,

        // Staff Management
        Permission.VIEW_STAFF,
        Permission.ADD_STAFF,
        Permission.EDIT_STAFF,
        Permission.DELETE_STAFF,

        // Batch Management
        Permission.VIEW_BATCH,
        Permission.ADD_BATCH,
        Permission.EDIT_BATCH,
        Permission.DELETE_BATCH,

        // Requests Management
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

        // Notifications
        Permission.VIEW_NOTIFICATIONS,
        Permission.SEND_MESSAGES,
        Permission.SEND_GENERAL_NOTIFICATION,

        // Profile
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,

        // Settings
        Permission.VIEW_SETTINGS,
        Permission.EDIT_SETTINGS,
    ],
};
