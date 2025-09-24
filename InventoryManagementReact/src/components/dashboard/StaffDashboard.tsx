import { useStaffDashboard } from '@/hooks/queries/useDashboard';
import { useUnreadCount } from '@/hooks/queries/useNotification';
import { useGetProfile } from '@/hooks/queries/useProfile';
import { useAuthStore } from '@/stores/authStore';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Package,
    XCircle,
} from 'lucide-react';
import StaffNotificationSummary from '../staff-dashboard/StaffNotificationSummary';
import StaffQuickActions from '../staff-dashboard/StaffQuickActions';
import StaffQuickSearchAndBrowse from '../staff-dashboard/StaffQuickSearchAndBrowse';
import StaffRecentRequests from '../staff-dashboard/StaffRecentRequests';
import StaffShoppingCart from '../staff-dashboard/StaffShoppingCart';
import StaffStatsGrid from '../staff-dashboard/StaffStatsGrid';
import StaffWelcome from '../staff-dashboard/StaffWelcome';
import { useNavigate } from 'react-router-dom';
import type { RequestStatus } from '@/types/request';

export function StaffDashboard() {
    const { user } = useAuthStore();
    const { data: profile } = useGetProfile();
    const { data: unreadCount = 0 } = useUnreadCount();
    const { data: dashboardData, isLoading, error } = useStaffDashboard();

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
    const cartItems = dashboardData?.cartItems || [];
    const cartTotal = dashboardData?.cartTotal || 0;
    const recentRequests = dashboardData?.recentRequests || [];

    // Cart items are now fetched from backend data

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
                <StaffShoppingCart />
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
