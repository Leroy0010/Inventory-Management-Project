import { useAdminDashboard } from '@/hooks/queries/useDashboard';
import { useUnreadCount } from '@/hooks/queries/useNotification';
import { useGetProfile } from '@/hooks/queries/useProfile';
import { useAuthStore } from '@/stores/authStore';
import { AlertTriangle } from 'lucide-react';
import AdminNotificationSummary from '../admin-dashboard/AdminNotificationSummary';
import AdminQuickActions from '../admin-dashboard/AdminQuickActions';
import AdminRecentActivity from '../admin-dashboard/AdminRecentActivity';
import AdminStatsGrid from '../admin-dashboard/AdminStatsGrid';
import AdminSystemOverview from '../admin-dashboard/AdminSystemOverview';
import AdminWelcomeSection from '../admin-dashboard/AdminWelcomeSection';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
    const { user } = useAuthStore();
    const { data: profile } = useGetProfile();
    const { data: unreadCount = 0 } = useUnreadCount();
    const { data: dashboardData, isLoading, error } = useAdminDashboard();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">
                        Failed to load dashboard data
                    </p>
                </div>
            </div>
        );
    }

    // Use real data from backend
    const stats = dashboardData?.stats || [];
    const quickActions =
        dashboardData?.quickActions.map((act) => ({
            ...act,
            action: () => act?.href && navigate(act?.href),
        })) || [];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <AdminWelcomeSection
                dashboardData={dashboardData}
                profile={profile}
                user={user}
            />
            {/* Stats Grid */}
            {stats.length > 0 && <AdminStatsGrid stats={stats} />}

            {/* Quick Actions */}
            {quickActions.length > 0 && (
                <AdminQuickActions quickActions={quickActions} />
            )}

            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminSystemOverview />
                {/* Recent Activity */}
                <AdminRecentActivity />
            </div>

            {/* Notification Summary */}
            <AdminNotificationSummary
                dashboardData={dashboardData}
                unreadCount={unreadCount}
            />
        </div>
    );
}
