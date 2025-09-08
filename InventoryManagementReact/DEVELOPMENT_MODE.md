# Development Mode

This React application includes a development mode that bypasses authentication and permission checks to allow easy testing and development of all pages and features.

## How to Enable/Disable Development Mode

### Quick Toggle
Edit `src/config/dev.ts` and modify the following flags:

```typescript
export const DEV_CONFIG = {
  // Bypass authentication - automatically log in as admin
  BYPASS_AUTH: true,  // Set to false for production
  
  // Bypass permission checks - allow access to all pages
  BYPASS_PERMISSIONS: true,  // Set to false for production
  
  // Show development warnings in console
  SHOW_DEV_WARNINGS: true,  // Set to false to hide warnings
};
```

### What Development Mode Does

1. **Authentication Bypass**:
   - Automatically logs you in as an admin user
   - No need to enter credentials
   - Skips all authentication checks

2. **Permission Bypass**:
   - Allows access to all pages regardless of user role
   - All permission checks return `true`
   - No "Access Denied" messages

3. **Notification System Disabled**:
   - NotificationProvider is disabled
   - Safe fallback for notification hooks
   - No notification errors or crashes

4. **Development Warnings**:
   - Shows a yellow banner at the top of the app
   - Console warnings about development mode
   - Reminds you to disable for production

## Current Development User

When development mode is enabled, you'll be automatically logged in as:
- **Name**: John Doe
- **Email**: admin@inventory.com
- **Role**: ADMIN
- **Permissions**: All permissions (due to bypass)

## Pages You Can Now Access

With development mode enabled, you can access all pages:

### Admin Pages
- `/` - Admin Dashboard
- `/departments` - Department Management
- `/staff/create-storekeeper` - Create Storekeeper

### Staff Pages
- `/staff-dashboard` - Staff Dashboard
- `/staff-inventory-items` - Browse Inventory
- `/cart` - Shopping Cart
- `/staff-requests` - Personal Requests

### Storekeeper Pages
- `/storekeeper-dashboard` - Storekeeper Dashboard
- `/staff` - Staff Management
- `/staff/add` - Add Staff
- `/inventory` - Inventory Management
- `/inventory/add` - Add Inventory
- `/office` - Office Management
- `/office/add` - Add Office
- `/batch` - Batch Management
- `/batch/add` - Add Batch
- `/inventory-items` - Inventory Items
- `/requests` - Request Management
- `/reports/transaction` - Transaction Reports
- `/reports/user` - User Reports
- `/reports/inventory-summary` - Inventory Summary Reports

### Common Pages
- `/profile` - User Profile
- `/requests/:id` - Request Details
- `/notifications` - Notifications
- `/send-message` - Send Messages
- `/settings` - Settings

## Testing Different Roles

To test different user roles, you can modify the `DEFAULT_USER` in `src/config/dev.ts`:

```typescript
DEFAULT_USER: {
  id: '1',
  email: 'admin@inventory.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'ADMIN', // Change to 'STAFF' or 'STOREKEEPER'
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

## Production Checklist

Before deploying to production, make sure to:

1. Set `BYPASS_AUTH: false`
2. Set `BYPASS_PERMISSIONS: false`
3. Set `SHOW_DEV_WARNINGS: false`
4. Test authentication flow
5. Test permission-based access control
6. Remove or hide the development banner

## Troubleshooting

### Pages Still Not Loading
- Check that `BYPASS_AUTH` is set to `true`
- Check that `BYPASS_PERMISSIONS` is set to `true`
- Clear browser cache and localStorage
- Check browser console for errors

### Permission Errors
- Ensure `BYPASS_PERMISSIONS` is set to `true`
- Check that the user role has the required permissions in `src/lib/permissions.ts`

### Authentication Issues
- Ensure `BYPASS_AUTH` is set to `true`
- Check that the `DEFAULT_USER` is properly configured
- Verify the AuthContext is properly imported

This development mode makes it easy to test all features and pages without dealing with authentication and permission complexities during development.
