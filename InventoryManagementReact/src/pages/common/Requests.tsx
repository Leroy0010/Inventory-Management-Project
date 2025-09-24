import { useAuthStore } from '@/stores/authStore';
import { RequestsLoading } from '@/components/requests/RequestsLoading';
import { RequestsRenderer } from '@/components/requests/RequestsRenderer';
import type { Role } from '@/types/auth';

export default function Dashboard() {
    const { user, isAuthenticated } = useAuthStore();

    // Show loading state while user data is being fetched
    if (user &&!user.role && isAuthenticated) {
        return <RequestsLoading />;
    }

    return <RequestsRenderer userRole={user?.role as Role} />;
}
