import { useAuthStore } from '@/stores/authStore';
import { AdminDashboard } from './AdminDashboard';
import { StorekeeperDashboard } from './StorekeeperDashboard';
import { StaffDashboard } from './StaffDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

export function MainDashboard() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Not Authenticated</h2>
            <p className="text-gray-500">Please log in to view your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while user data is being fetched
  if (!user.role) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <CardContent>
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Loading Dashboard</h2>
            <p className="text-gray-500">Please wait while we load your personalized dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (user.role.name) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'STOREKEEPER':
      return <StorekeeperDashboard />;
    case 'STAFF':
      return <StaffDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 text-center">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Unknown Role</h2>
              <p className="text-gray-500">
                Your role "{user.role.name}" is not recognized. Please contact your administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      );
  }
}
