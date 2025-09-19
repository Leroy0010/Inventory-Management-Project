import { useAuthStore } from '@/stores/authStore';
import { DashboardNotAuthenticated } from '@/components/dashboard/DashboardNotAuthenticated';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';
import { DashboardRenderer } from '@/components/dashboard/DashboardRenderer';

export default function Dashboard() {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <DashboardNotAuthenticated />;
    }

    // Show loading state while user data is being fetched
    if (!user.role) {
        return <DashboardLoading />;
    }

    return <DashboardRenderer userRole={user.role} />;
}
