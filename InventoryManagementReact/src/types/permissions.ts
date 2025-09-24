// Permission System Types
export const Permission = {
    // Dashboard
    VIEW_DASHBOARD: 'VIEW_DASHBOARD',

    // Department Management (Admin only)
    VIEW_DEPARTMENTS: 'VIEW_DEPARTMENTS',
    ADD_DEPARTMENT: 'ADD_DEPARTMENT',
    EDIT_DEPARTMENT: 'EDIT_DEPARTMENT',
    DELETE_DEPARTMENT: 'DELETE_DEPARTMENT',

    // Staff Management
    VIEW_STAFF: 'VIEW_STAFF',
    ADD_STAFF: 'ADD_STAFF',
    EDIT_STAFF: 'EDIT_STAFF',
    DELETE_STAFF: 'DELETE_STAFF',
    ADD_STOREKEEPER: 'ADD_STOREKEEPER',

    // Inventory Management
    VIEW_INVENTORY: 'VIEW_INVENTORY',
    ADD_INVENTORY: 'ADD_INVENTORY',
    EDIT_INVENTORY: 'EDIT_INVENTORY',
    DELETE_INVENTORY: 'DELETE_INVENTORY',

    // Office Management
    VIEW_OFFICE: 'VIEW_OFFICE',
    ADD_OFFICE: 'ADD_OFFICE',
    EDIT_OFFICE: 'EDIT_OFFICE',
    DELETE_OFFICE: 'DELETE_OFFICE',

    // Batch Management
    VIEW_BATCH: 'VIEW_BATCH',
    ADD_BATCH: 'ADD_BATCH',
    EDIT_BATCH: 'EDIT_BATCH',
    DELETE_BATCH: 'DELETE_BATCH',

    // Requests
    VIEW_REQUESTS: 'VIEW_REQUESTS',
    APPROVE_REQUESTS: 'APPROVE_REQUESTS',
    REJECT_REQUESTS: 'REJECT_REQUESTS',
    MANAGE_REQUESTS: 'MANAGE_REQUESTS',
    FULFIL_REQUESTS: 'FULFIL_REQUESTS',

    // Cart (Staff specific)
    VIEW_CART: 'VIEW_CART',
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    CHECKOUT_CART: 'CHECKOUT_CART',

    // Notifications
    VIEW_NOTIFICATIONS: 'VIEW_NOTIFICATIONS',
    SEND_MESSAGES: 'SEND_MESSAGES',
    SEND_GENERAL_NOTIFICATION: 'SEND_GENERAL_NOTIFICATION',

    // Reports (Storekeeper specific)
    VIEW_REPORTS: 'VIEW_REPORTS',
    VIEW_TRANSACTION_REPORTS: 'VIEW_TRANSACTION_REPORTS',
    VIEW_USER_REPORTS: 'VIEW_USER_REPORTS',
    VIEW_INVENTORY_SUMMARY_REPORTS: 'VIEW_INVENTORY_SUMMARY_REPORTS',
    EXPORT_REPORTS: 'EXPORT_REPORTS',
    VIEW_ACTIVITY_REPORTS: 'VIEW_ACTIVITY_REPORTS',

    // Profile and Common
    VIEW_PROFILE: 'VIEW_PROFILE',
    EDIT_PROFILE: 'EDIT_PROFILE',
    VIEW_REQUEST_DETAILS: 'VIEW_REQUEST_DETAILS',
    VIEW_INVENTORY_ITEM_DETAILS: 'VIEW_INVENTORY_ITEM_DETAILS',

    // Settings
    VIEW_SETTINGS: 'VIEW_SETTINGS',
    EDIT_SETTINGS: 'EDIT_SETTINGS',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
    ADMIN: [
        // Dashboard
        Permission.VIEW_DASHBOARD,

        // Common pages (all roles have access)
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,
        Permission.VIEW_NOTIFICATIONS,
        Permission.SEND_MESSAGES,
        Permission.VIEW_SETTINGS,
        Permission.EDIT_SETTINGS,

        // Admin-specific pages
        Permission.VIEW_DEPARTMENTS,
        Permission.ADD_DEPARTMENT,
        Permission.EDIT_DEPARTMENT,
        Permission.DELETE_DEPARTMENT,
        Permission.ADD_STOREKEEPER,
        Permission.SEND_GENERAL_NOTIFICATION,
    ],
    STAFF: [
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
    STOREKEEPER: [
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
        Permission.APPROVE_REQUESTS,
        Permission.REJECT_REQUESTS,
        Permission.MANAGE_REQUESTS,
        Permission.FULFIL_REQUESTS,
        Permission.VIEW_REQUEST_DETAILS,

        // Reports
        Permission.VIEW_REPORTS,
        Permission.VIEW_TRANSACTION_REPORTS,
        Permission.VIEW_USER_REPORTS,
        Permission.VIEW_INVENTORY_SUMMARY_REPORTS,
        Permission.VIEW_ACTIVITY_REPORTS,

        Permission.EXPORT_REPORTS,
    ],
};
