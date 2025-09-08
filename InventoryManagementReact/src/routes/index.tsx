import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Permission } from '@/types';

// Lazy load pages for better performance
// Common pages
const Login = React.lazy(() => import('@/pages/Login'));
const Unauthorized = React.lazy(() => import('@/pages/Unauthorized'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Profile = React.lazy(() => import('@/pages/common/Profile'));
const RequestDetails = React.lazy(() => import('@/pages/common/RequestDetails'));

// Admin pages
const AdminDashboard = React.lazy(() => import('@/pages/Dashboard'));
const Departments = React.lazy(() => import('@/pages/admin/Departments'));
const CreateStorekeeper = React.lazy(() => import('@/pages/admin/CreateStorekeeper'));

// Staff pages
const StaffDashboard = React.lazy(() => import('@/pages/Dashboard'));
const StaffInventoryItems = React.lazy(() => import('@/pages/InventoryItems'));
const StaffCart = React.lazy(() => import('@/pages/staff/Cart'));
const StaffRequests = React.lazy(() => import('@/pages/Requests'));

// Storekeeper pages
const StorekeeperDashboard = React.lazy(() => import('@/pages/Dashboard'));
const Staff = React.lazy(() => import('@/pages/Staff'));
const AddStaff = React.lazy(() => import('@/pages/storekeeper/AddStaff'));
const Inventory = React.lazy(() => import('@/pages/Inventory'));
const AddInventory = React.lazy(() => import('@/pages/storekeeper/AddInventory'));
const Office = React.lazy(() => import('@/pages/Office'));
const AddOffice = React.lazy(() => import('@/pages/storekeeper/AddOffice'));
const Batch = React.lazy(() => import('@/pages/Batch'));
const AddBatch = React.lazy(() => import('@/pages/storekeeper/AddBatch'));
const InventoryItems = React.lazy(() => import('@/pages/InventoryItems'));
const Requests = React.lazy(() => import('@/pages/Requests'));
const TransactionReport = React.lazy(() => import('@/pages/storekeeper/TransactionReport'));
const UserReport = React.lazy(() => import('@/pages/storekeeper/UserReport'));
const InventorySummaryReport = React.lazy(() => import('@/pages/storekeeper/InventorySummaryReport'));

// Common pages
const Notifications = React.lazy(() => import('@/pages/Notifications'));
const SendMessage = React.lazy(() => import('@/pages/SendMessage'));
const Settings = React.lazy(() => import('@/pages/Settings'));

// Development/Test pages
const ThemeTest = React.lazy(() => import('@/components/ThemeTest'));
const GoogleSignInTest = React.lazy(() => import('@/components/GoogleSignInTest'));
const SidebarStyleDemo = React.lazy(() => import('@/components/SidebarStyleDemo'));
const SearchDemo = React.lazy(() => import('@/components/SearchDemo'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Route configuration
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Unauthorized />
      </Suspense>
    )
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard - role-based
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_DASHBOARD]}>
              <AdminDashboard />
            </ProtectedRoute>
          </Suspense>
        )
      },
      
      // Admin routes
      {
        path: 'departments',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_DEPARTMENTS]}>
              <Departments />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'staff/create-storekeeper',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.CREATE_STOREKEEPER]}>
              <CreateStorekeeper />
            </ProtectedRoute>
          </Suspense>
        )
      },
      
      // Staff routes
      {
        path: 'staff-dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_DASHBOARD]}>
              <StaffDashboard />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'staff-inventory-items',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_INVENTORY]}>
              <StaffInventoryItems />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_CART]}>
              <StaffCart />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'staff-requests',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_REQUESTS]}>
              <StaffRequests />
            </ProtectedRoute>
          </Suspense>
        )
      },
      
      // Storekeeper routes
      {
        path: 'storekeeper-dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_DASHBOARD]}>
              <StorekeeperDashboard />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'staff',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_STAFF]}>
              <Staff />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'staff/add',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.ADD_STAFF]}>
              <AddStaff />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'inventory',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_INVENTORY]}>
              <Inventory />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'inventory/add',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.ADD_INVENTORY]}>
              <AddInventory />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'office',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_OFFICE]}>
              <Office />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'office/add',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.ADD_OFFICE]}>
              <AddOffice />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'batch',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_BATCH]}>
              <Batch />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'batch/add',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.ADD_BATCH]}>
              <AddBatch />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'inventory-items',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_INVENTORY]}>
              <InventoryItems />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'requests',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_REQUESTS]}>
              <Requests />
            </ProtectedRoute>
          </Suspense>
        )
      },
      
      // Report routes (Storekeeper only)
      {
        path: 'reports/transaction',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_TRANSACTION_REPORTS]}>
              <TransactionReport />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'reports/user',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_USER_REPORTS]}>
              <UserReport />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'reports/inventory-summary',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_INVENTORY_SUMMARY_REPORTS]}>
              <InventorySummaryReport />
            </ProtectedRoute>
          </Suspense>
        )
      },
      
      // Common routes
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_PROFILE]}>
              <Profile />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'requests/:requestId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_REQUEST_DETAILS]}>
              <RequestDetails />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'notifications',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_NOTIFICATIONS]}>
              <Notifications />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'send-message',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.SEND_MESSAGES]}>
              <SendMessage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute requiredPermissions={[Permission.VIEW_SETTINGS]}>
              <Settings />
            </ProtectedRoute>
          </Suspense>
        )
      },
      
      // Development/Test routes
      {
        path: 'dev/theme-test',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ThemeTest />
          </Suspense>
        )
      },
      {
        path: 'dev/google-test',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GoogleSignInTest />
          </Suspense>
        )
      },
      {
        path: 'dev/sidebar-demo',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SidebarStyleDemo />
          </Suspense>
        )
      },
      {
        path: 'dev/search-demo',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchDemo />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    )
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
