import { useAuthStore } from '@/stores/authStore';
import { useGetProfile } from '@/hooks/queries/useProfile';
import { useUnreadCount } from '@/hooks/queries/useNotification';
import { useStaffDashboard } from '@/hooks/queries/useDashboard';
import StaffWelcome from '../staff-dashboard/StaffWelcome';
import StaffStatsGrid from '../staff-dashboard/StaffStatsGrid';
import StaffNotificationSummary from '../staff-dashboard/StaffNotificationSummary';
import StaffQuickSearchAndBrowse from '../staff-dashboard/StaffQuickSearchAndBrowse';
import StaffShoppingCart from '../staff-dashboard/StaffShoppingCart';
import StaffRecentRequests from '../staff-dashboard/StaffRecentRequests';
import StaffQuickActions from '../staff-dashboard/StaffQuickActions';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

export function StaffDashboard() {
    const { user } = useAuthStore();
    const { data: profile } = useGetProfile();
    const { data: unreadCount = 0 } = useUnreadCount();
    const { data: dashboardData, isLoading, error } = useStaffDashboard();

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
    const cartItems = dashboardData?.cartItems || [];
    const cartTotal = dashboardData?.cartTotal || 0;
    const recentRequests = dashboardData?.recentRequests || [];

    // Cart items are now fetched from backend data

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

    // Cart total is now provided by backend

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <StaffWelcome profile={profile} user={user} />

            {/* Stats Grid */}
            {stats.length > 0 && <StaffStatsGrid stats={stats} />}

            {/* Quick Actions */}
            {quickActions.length > 0 && (
                <StaffQuickActions quickActions={quickActions} />
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Requests */}
                <StaffRecentRequests
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    recentRequests={recentRequests}
                />
                {/* Shopping Cart */}
                <StaffShoppingCart
                    cartItems={cartItems}
                    cartTotal={cartTotal}
                />
            </div>

            {/* Quick Search and Browse */}
            <StaffQuickSearchAndBrowse />

            {/* Notifications Summary */}
            {unreadCount > 0 && (
                <StaffNotificationSummary unreadCount={unreadCount} />
            )}
        </div>
    );
}
