package com.leroy.inventorymanagementspringboot.enums;

public enum RecipientType {
    ALL_USERS, // All users in the system (for Admin)
    DEPARTMENT_USERS, // All users in a specific department (for Admin/Storekeeper)
    SPECIFIC_USERS // Selected users by ID
}
