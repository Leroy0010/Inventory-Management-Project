import { Card, CardContent } from '@/components/ui/card';
import {
    Package,
    Users,
    Building2,
    TrendingUp,
    AlertTriangle,
    BarChart3,
    FileText,
    Bell,
    Activity,
    CheckCircle,
    Clock,
    XCircle,
    ShoppingCart,
} from 'lucide-react';

// Icon mapping for dynamic icons
const iconMap = {
    Package,
    Users,
    Building2,
    TrendingUp,
    AlertTriangle,
    BarChart3,
    FileText,
    Bell,
    Activity,
    CheckCircle,
    Clock,
    XCircle,
    ShoppingCart,
} as const;
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useGetProfile } from '@/hooks/queries/useProfile';
import { useUnreadCount } from '@/hooks/queries/useNotification';
import { useStorekeeperDashboard } from '@/hooks/queries/useDashboard';
import StorekeeperNotificationSummary from '../storekeeper-dashboard/StorekeeperNotificationSummary';
import StorekeeperReportSection from '../storekeeper-dashboard/StorekeeperReportSection';
import StorekeeperDepartmentOverview from '../storekeeper-dashboard/StorekeeperDepartmentOverview';
import StorekeeperWelcomeSection from '../storekeeper-dashboard/StorekeeperWelcomeSection';
import StorekeeperRecentRequests from '../storekeeper-dashboard/StorekeeperRecentRequests';
import StorekeeperQuickActions from '../storekeeper-dashboard/StorekeeperQuickActions';
import StorekeeperStatsGrid from '../storekeeper-dashboard/StorekeeperStatsGrid';
import { InventorySummary } from './InventorySummary';
import { RoleBasedQuickActions } from './RoleBasedQuickActions';

export function StorekeeperDashboard() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data: profile } = useGetProfile();
    const { data: unreadCount = 0 } = useUnreadCount();
    const { data: dashboardData, isLoading, error } = useStorekeeperDashboard();

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
    const quickActions = dashboardData?.quickActions || [];
    const stats = dashboardData?.stats || [];
    const departmentOverview = dashboardData?.departmentOverview;
    const recentRequests = dashboardData?.recentRequests || [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-orange-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'text-green-600 bg-green-50';
            case 'rejected':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-orange-600 bg-orange-50';
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <StorekeeperWelcomeSection profile={profile} user={user} />
            {/* Stats Grid */}
            {stats.length > 0 && <StorekeeperStatsGrid stats={stats} />}

            {/* Quick Actions */}
            <RoleBasedQuickActions />
            {quickActions.length > 0 && (
                <StorekeeperQuickActions quickActions={quickActions} />
            )}

            {/* Inventory Summary */}
            <InventorySummary />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Requests */}
                <StorekeeperRecentRequests
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    recentRequests={recentRequests}
                />
                {/* Department Overview */}
                <StorekeeperDepartmentOverview
                    departmentOverview={departmentOverview}
                />
            </div>

            {/* Notification Summary */}
            <StorekeeperNotificationSummary
                dashboardData={dashboardData}
                unreadCount={unreadCount}
            />
            {/* Reports Section */}
            <StorekeeperReportSection />
        </div>
    );
}
