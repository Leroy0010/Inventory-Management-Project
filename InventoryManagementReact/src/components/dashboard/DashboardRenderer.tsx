import { Suspense, lazy } from 'react';
import { DashboardLoading } from './DashboardLoading';
import { DashboardUnknownRole } from './DashboardUnknownRole';

// Lazy load dashboard components for better performance
const AdminDashboard = lazy(() =>
    import('@/components/dashboard/AdminDashboard').then((module) => ({
        default: module.AdminDashboard,
    }))
);
const StorekeeperDashboard = lazy(() =>
    import('@/components/dashboard/StorekeeperDashboard').then((module) => ({
        default: module.StorekeeperDashboard,
    }))
);
const StaffDashboard = lazy(() =>
    import('@/components/dashboard/StaffDashboard').then((module) => ({
        default: module.StaffDashboard,
    }))
);

interface DashboardRendererProps {
    userRole: string;
}

export function DashboardRenderer({ userRole }: DashboardRendererProps) {
    const renderDashboard = () => {
        switch (userRole) {
            case 'ADMIN':
                return <AdminDashboard />;
            case 'STOREKEEPER':
                return <StorekeeperDashboard />;
            case 'STAFF':
                return <StaffDashboard />;
            default:
                return <DashboardUnknownRole role={userRole} />;
        }
    };

    return (
        <Suspense
            fallback={
                <DashboardLoading
                    message="Loading Dashboard"
                    description="Please wait while we load your personalized dashboard..."
                />
            }
        >
            {renderDashboard()}
        </Suspense>
    );
}
