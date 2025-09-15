import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  BarChart3,
  Settings,
  Bell,
  Activity,
  Package,
  CheckCircle
} from 'lucide-react';

// Icon mapping for dynamic icons
const iconMap = {
  Building2,
  Shield,
  Activity,
  Bell,
  Settings,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  BarChart3
} as const;
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useGetProfile } from '@/hooks/queries/useProfile';
import { useUnreadCount } from '@/hooks/queries/useNotification';
import { useAdminDashboard } from '@/hooks/queries/useDashboard';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: profile } = useGetProfile();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: dashboardData, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  // Use real data from backend
  const stats = dashboardData?.stats || [];
  const quickActions = dashboardData?.quickActions || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {dashboardData?.welcomeMessage || `Welcome back, ${profile?.firstName || user?.firstName}!`}
            </h1>
            <p className="text-blue-100 text-lg">
              System Administrator Dashboard
            </p>
            <p className="text-blue-200 text-sm mt-1">
              Manage departments, users, and system-wide settings
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
            <p className="text-sm text-blue-200">
              Last login: {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString() : 'Today'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color.replace('text', 'bg').replace('-600', '-100')}`}>
                    {(() => {
                      const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
                      return IconComponent ? <IconComponent className={`h-6 w-6 ${stat.color}`} /> : null;
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group" onClick={action.action || (() => navigate(action.href || '/'))}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                    {(() => {
                      const IconComponent = iconMap[action.icon as keyof typeof iconMap];
                      return IconComponent ? <IconComponent className="h-6 w-6 text-white" /> : null;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Overview
            </CardTitle>
            <CardDescription>
              Key metrics and system status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Database</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">API Services</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Running</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system events and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New department created</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Storekeeper registered</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
