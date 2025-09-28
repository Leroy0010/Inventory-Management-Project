import { useStorekeeperDashboard } from '@/hooks/queries/useDashboard';
import { useUnreadCount } from '@/hooks/queries/useNotification';
import { useProfile } from '@/hooks/queries/useAuth';
import { useAuthStore } from '@/stores/authStore';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    Building2,
    CheckCircle,
    Clock,
    FileText,
    Package,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react';
import StorekeeperNotificationSummary from '../storekeeper-dashboard/StorekeeperNotificationSummary';
import StorekeeperQuickActions from '../storekeeper-dashboard/StorekeeperQuickActions';
import StorekeeperRecentRequests from '../storekeeper-dashboard/StorekeeperRecentRequests';
import StorekeeperReportSection from '../storekeeper-dashboard/StorekeeperReportSection';
import StorekeeperStatsGrid from '../storekeeper-dashboard/StorekeeperStatsGrid';
import StorekeeperWelcomeSection from '../storekeeper-dashboard/StorekeeperWelcomeSection';
import { useNavigate } from 'react-router-dom';
import type { RequestStatus } from '@/types/request';

// Icon mapping for dynamic icons

export function StorekeeperDashboard() {
    const { user } = useAuthStore();
    const { data: profile } = useProfile();
    const { data: unreadCount = 0 } = useUnreadCount();
    const { data: dashboardData, isLoading, error } = useStorekeeperDashboard();
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
    const quickActions =
        dashboardData?.quickActions.map((act) => ({
            ...act,
            action: () => act?.href && navigate(act?.href),
        })) || [];
    const stats = dashboardData?.stats || [];
    const recentRequests = dashboardData?.recentRequests || [];

    const getStatusIcon = (status: RequestStatus) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'REJECTED':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'FULFILLED':
                return <Package className="h-4 w-4 text-blue-500" />;
            default:
                return <Clock className="h-4 w-4 text-orange-500" />;
        }
    };

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'FULFILLED':
                return 'bg-blue-100 text-blue-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <StorekeeperWelcomeSection profile={profile} user={user} />
            {/* Stats Grid */}
            {stats.length > 0 && <StorekeeperStatsGrid stats={stats} />}

            {/* Quick Actions */}

            {quickActions.length > 0 && (
                <StorekeeperQuickActions quickActions={quickActions} />
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Requests */}
                <StorekeeperRecentRequests
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    recentRequests={recentRequests}
                />
                {/* Reports Section */}
                <StorekeeperReportSection />
            </div>

            {/* Notification Summary */}
            {unreadCount > 0 && (
                <StorekeeperNotificationSummary
                    dashboardData={dashboardData}
                    unreadCount={unreadCount}
                />
            )}
        </div>
    );
}
