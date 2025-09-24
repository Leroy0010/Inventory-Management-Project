import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Permission } from '@/types/permissions';
import {
    AddBatch,
    AddDepartment,
    AddInventory,
    AddOffice,
    AddStaff,
    AddStorekeeper,
    Batch,
    Dashboard,
    Departments,
    ForgotPassword,
    InventoryItemDetails,
    InventoryItems,
    InventorySummaryReport,
    Login,
    NotFound,
    Notifications,
    Office,
    OfficeDetails,
    Profile,
    RequestDetails,
    SendMessage,
    Settings,
    Staff,
    StaffCart,
    StaffDetails,
    StaffRequests,
    StorekeeperRequests,
    TransactionReport,
    Unauthorized,
    UserActivityReport,
    UserReport,
} from './lazyLoadPages.ts';

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
        ),
    },
    {
        path: '/forgot-password',
        element: (
            <Suspense fallback={<PageLoader />}>
                <ForgotPassword />
            </Suspense>
        ),
    },

    {
        path: '/unauthorized',
        element: (
            <Suspense fallback={<PageLoader />}>
                <Unauthorized />
            </Suspense>
        ),
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
                path: '',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_DASHBOARD]}
                        >
                            <Dashboard />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },

            // Admin routes
            {
                path: 'departments',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_DEPARTMENTS]}
                        >
                            <Departments />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: '/storekeeper/add',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.ADD_STOREKEEPER]}
                        >
                            <AddStorekeeper />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'departments/add',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.ADD_DEPARTMENT]}
                        >
                            <AddDepartment />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },

            // Staff routes

            {
                path: 'cart',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_CART]}
                        >
                            <StaffCart />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'staff-requests',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_REQUESTS]}
                        >
                            <StaffRequests />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },

            // Storekeeper routes
            {
                path: 'staff',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_STAFF]}
                        >
                            <Staff />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'staff/:id',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_STAFF]}
                        >
                            <StaffDetails />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'staff/add',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.ADD_STAFF]}
                        >
                            <AddStaff />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'inventory/add',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.ADD_INVENTORY]}
                        >
                            <AddInventory />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'office',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_OFFICE]}
                        >
                            <Office />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'office/:id',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_OFFICE]}
                        >
                            <OfficeDetails />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'office/add',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.ADD_OFFICE]}
                        >
                            <AddOffice />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'batch',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_BATCH]}
                        >
                            <Batch />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'batch/add',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.ADD_BATCH]}
                        >
                            <AddBatch />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'inventory-items',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_INVENTORY]}
                        >
                            <InventoryItems />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'inventory-items/:id',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_INVENTORY]}
                        >
                            <InventoryItemDetails />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'requests',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.MANAGE_REQUESTS]}
                        >
                            <StorekeeperRequests />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },

            // Report routes (Storekeeper only)
            {
                path: 'reports/transaction',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[
                                Permission.VIEW_TRANSACTION_REPORTS,
                            ]}
                        >
                            <TransactionReport />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'reports/user',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_USER_REPORTS]}
                        >
                            <UserReport />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'reports/user-activity',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_USER_REPORTS]}
                        >
                            <UserActivityReport />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'reports/inventory-summary',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[
                                Permission.VIEW_INVENTORY_SUMMARY_REPORTS,
                            ]}
                        >
                            <InventorySummaryReport />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },

            // Common routes
            {
                path: 'profile',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_PROFILE]}
                        >
                            <Profile />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'notifications',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'requests/:requestId',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[
                                Permission.VIEW_REQUEST_DETAILS,
                            ]}
                        >
                            <RequestDetails />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'send-message',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.SEND_MESSAGES]}
                        >
                            <SendMessage />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'settings',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ProtectedRoute
                            requiredPermissions={[Permission.VIEW_SETTINGS]}
                        >
                            <Settings />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '*',
        element: (
            <Suspense fallback={<PageLoader />}>
                <NotFound />
            </Suspense>
        ),
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
