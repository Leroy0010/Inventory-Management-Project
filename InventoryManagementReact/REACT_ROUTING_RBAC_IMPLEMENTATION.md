# React App Routing and RBAC Implementation

## Overview

This implementation creates a comprehensive role-based access control (RBAC) system for the React frontend that mirrors the JavaFX page structure and provides secure, role-specific navigation and functionality.

## Page Structure Based on JavaFX Enums

### Admin Pages (`AdminPages.java`)

- **Dashboard** - Admin overview and system statistics
- **Departments** - Department management (create, edit, delete)
- **Create Storekeeper** - Add new storekeeper users

### Staff Pages (`StaffPages.java`)

- **Dashboard** - Staff overview and personal statistics
- **Inventory Items** - View available inventory items
- **Cart** - Shopping cart for requesting items
- **Requests** - View personal requests and status

### Storekeeper Pages (`StorekeeperPages.java`)

- **Dashboard** - Storekeeper overview and management statistics
- **Add Inventory** - Add new inventory items
- **Add Office** - Add new office locations
- **Add Staff** - Add new staff members
- **Inventory Items** - Manage inventory items
- **Add Batch** - Add new inventory batches
- **Requests** - Manage and approve/reject requests
- **Transaction Report** - View transaction history and analytics
- **User Report** - View user activity and request patterns
- **Inventory Summary Report** - Comprehensive inventory overview

### Common Pages (`CommonPages.java`)

- **Login** - User authentication
- **Profile** - User profile management
- **Request Details** - Detailed view of individual requests
- **Notifications** - System notifications
- **Settings** - Application settings

## Permission System

### Enhanced Permissions

The permission system has been expanded to include:

#### Department Management (Admin only)

- `VIEW_DEPARTMENTS` - View department list
- `ADD_DEPARTMENT` - Create new departments
- `EDIT_DEPARTMENT` - Edit existing departments
- `DELETE_DEPARTMENT` - Remove departments

#### Staff Management

- `CREATE_STOREKEEPER` - Create storekeeper accounts (Admin only)
- `VIEW_STAFF`, `ADD_STAFF`, `EDIT_STAFF`, `DELETE_STAFF` - Staff CRUD operations

#### Cart Functionality (Staff specific)

- `VIEW_CART` - View shopping cart
- `ADD_TO_CART` - Add items to cart
- `REMOVE_FROM_CART` - Remove items from cart
- `CHECKOUT_CART` - Submit cart as request

#### Reports (Storekeeper specific)

- `VIEW_TRANSACTION_REPORTS` - Access transaction reports
- `VIEW_USER_REPORTS` - Access user activity reports
- `VIEW_INVENTORY_SUMMARY_REPORTS` - Access inventory summary reports

#### Common Features

- `VIEW_PROFILE`, `EDIT_PROFILE` - Profile management
- `VIEW_REQUEST_DETAILS` - Detailed request viewing
- `SEND_GENERAL_NOTIFICATION` - Send system-wide notifications

## Role-Based Access Control

### Admin Role

- **Full Access**: All permissions across the system
- **Key Features**: Department management, user creation, system oversight
- **Pages**: Admin dashboard, departments, create storekeeper

### Staff Role

- **Limited Access**: View-only for most inventory, cart functionality
- **Key Features**: Browse inventory, manage cart, create requests
- **Pages**: Staff dashboard, inventory items, cart, personal requests

### Storekeeper Role

- **Management Access**: Full inventory and staff management
- **Key Features**: Inventory management, request approval, reporting
- **Pages**: Storekeeper dashboard, inventory management, staff management, reports

## Route Structure

### Route Organization

```
/ (Protected)
├── / (Dashboard - role-based)
├── /departments (Admin only)
├── /staff/create-storekeeper (Admin only)
├── /staff-dashboard (Staff)
├── /staff-inventory-items (Staff)
├── /cart (Staff)
├── /staff-requests (Staff)
├── /storekeeper-dashboard (Storekeeper)
├── /staff (Storekeeper)
├── /staff/add (Storekeeper)
├── /inventory (Storekeeper)
├── /inventory/add (Storekeeper)
├── /office (Storekeeper)
├── /office/add (Storekeeper)
├── /batch (Storekeeper)
├── /batch/add (Storekeeper)
├── /inventory-items (Storekeeper)
├── /requests (Storekeeper)
├── /reports/transaction (Storekeeper)
├── /reports/user (Storekeeper)
├── /reports/inventory-summary (Storekeeper)
├── /profile (All roles)
├── /requests/:requestId (All roles)
├── /notifications (All roles)
├── /send-message (All roles)
└── /settings (All roles)
```

### Route Protection

- All routes are protected by `ProtectedRoute` component
- Each route requires specific permissions
- Unauthorized access redirects to `/unauthorized`
- Role-based dashboard routing

## Key Features Implemented

### 1. Department Management (Admin)

- **Page**: `/departments`
- **Features**: CRUD operations for departments
- **Components**: Department list, create/edit forms, search/filter
- **Permissions**: `VIEW_DEPARTMENTS`, `ADD_DEPARTMENT`, `EDIT_DEPARTMENT`, `DELETE_DEPARTMENT`

### 2. Cart System (Staff)

- **Page**: `/cart`
- **Features**: Add/remove items, quantity management, checkout
- **Components**: Cart table, item management, checkout dialog
- **Permissions**: `VIEW_CART`, `ADD_TO_CART`, `REMOVE_FROM_CART`, `CHECKOUT_CART`

### 3. Reporting System (Storekeeper)

- **Pages**: `/reports/transaction`, `/reports/user`, `/reports/inventory-summary`
- **Features**: Analytics, filtering, export functionality
- **Components**: Summary cards, data tables, charts, filters
- **Permissions**: `VIEW_TRANSACTION_REPORTS`, `VIEW_USER_REPORTS`, `VIEW_INVENTORY_SUMMARY_REPORTS`

### 4. Profile Management (All Roles)

- **Page**: `/profile`
- **Features**: View/edit personal information, avatar management
- **Components**: Profile form, avatar upload, information display
- **Permissions**: `VIEW_PROFILE`, `EDIT_PROFILE`

### 5. Request Details (All Roles)

- **Page**: `/requests/:requestId`
- **Features**: Detailed request view, approval/rejection (Storekeeper)
- **Components**: Request information, items table, action buttons
- **Permissions**: `VIEW_REQUEST_DETAILS`, `APPROVE_REQUESTS`, `REJECT_REQUESTS`

## Security Features

### 1. Permission-Based Access

- Each page checks for required permissions
- Unauthorized access shows access denied message
- Graceful fallback for missing permissions

### 2. Role-Based Navigation

- Navigation menus show only accessible pages
- Dynamic routing based on user role
- Consistent user experience across roles

### 3. Data Protection

- Sensitive operations require specific permissions
- Form validation and error handling
- Secure API integration patterns

## Implementation Benefits

### 1. Scalability

- Easy to add new roles and permissions
- Modular page structure
- Reusable components

### 2. Security

- Comprehensive permission system
- Role-based access control
- Secure route protection

### 3. User Experience

- Role-specific interfaces
- Intuitive navigation
- Consistent design patterns

### 4. Maintainability

- Clear separation of concerns
- Organized file structure
- Comprehensive documentation

## Usage Examples

### Adding a New Permission

1. Add permission to `Permission` enum in `types/index.ts`
2. Update role permissions in `lib/permissions.ts`
3. Use permission in component with `usePermissions` hook

### Adding a New Page

1. Create page component in appropriate directory
2. Add lazy import to `routes/index.tsx`
3. Add route with proper permission checks
4. Update navigation components

### Adding a New Role

1. Add role to `UserRole` enum
2. Define permissions in `ROLE_PERMISSIONS`
3. Create role-specific pages and routes
4. Update navigation logic

## Testing

### Manual Testing

- Test each role's access to different pages
- Verify permission-based UI elements
- Test navigation between pages
- Validate form submissions and error handling

### Automated Testing

- Unit tests for permission checks
- Integration tests for route protection
- Component tests for role-specific features

This implementation provides a robust, secure, and user-friendly RBAC system that closely mirrors the JavaFX application structure while leveraging modern React patterns and best practices.
