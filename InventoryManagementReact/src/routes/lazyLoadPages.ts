import React from 'react';

// Common pages
export const Login = React.lazy(() => import('@/pages/auth/Login'));
export const ForgotPassword = React.lazy(
    () => import('@/pages/auth/ForgotPassword')
);

export const ResetPasswordForm = React.lazy(
    () => import('@/components/forms/ResetPasswordForm')
)

export const ForgotPasswordForm = React.lazy(
    () => import('@/components/forms/ForgotPasswordForm')
)

export const Unauthorized = React.lazy(() => import('@/pages/Unauthorized'));
export const NotFound = React.lazy(() => import('@/pages/NotFound'));
export const Profile = React.lazy(() => import('@/pages/common/Profile'));
export const RequestDetails = React.lazy(
    () => import('@/pages/common/RequestDetails')
);

export const SendMessage = React.lazy(() => import('@/pages/SendMessage'));
export const Settings = React.lazy(() => import('@/pages/Settings'));
export const Notifications = React.lazy(() => import('@/pages/Notifications'));
export const Dashboard = React.lazy(() => import('@/pages/common/Dashboard'));

// Admin pages

export const Departments = React.lazy(
    () => import('@/pages/admin/Departments')
);
export const AddStorekeeper = React.lazy(
    () => import('@/pages/admin/AddStorekeeper')
);
export const AddDepartment = React.lazy(
    () => import('@/pages/admin/AddDepartment')
);

// Staff pages
export const StaffCart = React.lazy(() => import('@/pages/staff/Cart'));
export const StaffRequests = React.lazy(
    () => import('@/pages/staff/MyRequests')
);

// Storekeeper pages

export const Staff = React.lazy(() => import('@/pages/storekeeper/Staff'));
export const StaffDetails = React.lazy(
    () => import('@/pages/storekeeper/StaffDetails')
);
export const AddStaff = React.lazy(
    () => import('@/pages/storekeeper/AddStaff')
);
export const AddInventory = React.lazy(
    () => import('@/pages/storekeeper/AddInventory')
);
export const Office = React.lazy(() => import('@/pages/storekeeper/Office'));
export const OfficeDetails = React.lazy(
    () => import('@/pages/storekeeper/OfficeDetails')
);
export const AddOffice = React.lazy(
    () => import('@/pages/storekeeper/AddOffice')
);
export const Batch = React.lazy(() => import('@/pages/storekeeper/Batch'));
export const AddBatch = React.lazy(
    () => import('@/pages/storekeeper/AddBatch')
);
export const InventoryItems = React.lazy(
    () => import('@/pages/common/InventoryItems')
);
export const InventoryItemDetails = React.lazy(
    () => import('@/pages/common/InventoryItemDetails')
);
export const StorekeeperRequests = React.lazy(
    () => import('@/pages/storekeeper/ManageRequests')
);
export const TransactionReport = React.lazy(
    () => import('@/pages/storekeeper/TransactionReport')
);
export const UserReport = React.lazy(
    () => import('@/pages/storekeeper/UserReport')
);
export const UserActivityReport = React.lazy(
    () => import('@/pages/storekeeper/UserActivityReport')
);
export const InventorySummaryReport = React.lazy(
    () => import('@/pages/storekeeper/InventorySummaryReport')
);

// Heavy UI components
export const ImageUpload = React.lazy(
    () => import('@/components/ui/image-upload')
);
