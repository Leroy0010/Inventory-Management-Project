import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Users, 
  Building2, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  BarChart3,
  FileText,
  Bell,
  Activity,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useGetProfile } from '@/hooks/queries/useProfile';
import { useUnreadCount } from '@/hooks/queries/useNotification';

export function StorekeeperDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: profile } = useGetProfile();
  const { data: unreadCount = 0 } = useUnreadCount();

  const quickActions = [
    {
      title: 'Manage Inventory',
      description: 'Add and manage inventory items',
      icon: Package,
      action: () => navigate('/inventory/add'),
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Staff',
      description: 'Add and manage department staff',
      icon: Users,
      action: () => navigate('/staff'),
      color: 'bg-green-500',
    },
    {
      title: 'Manage Offices',
      description: 'Create and manage offices',
      icon: Building2,
      action: () => navigate('/office'),
      color: 'bg-purple-500',
    },
    {
      title: 'View Reports',
      description: 'Generate and view reports',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-orange-500',
    },
  ];

  const stats = [
    {
      title: 'Total Inventory Items',
      value: '1,247',
      change: '+23 this week',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Requests',
      value: '12',
      change: 'Awaiting approval',
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: 'Department Staff',
      value: '45',
      change: '+3 this month',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Low Stock Items',
      value: '8',
      change: 'Need restocking',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
  ];

  const recentRequests = [
    { id: 1, staff: 'John Doe', item: 'Office Supplies', status: 'pending', time: '2 hours ago' },
    { id: 2, staff: 'Jane Smith', item: 'IT Equipment', status: 'approved', time: '4 hours ago' },
    { id: 3, staff: 'Mike Johnson', item: 'Cleaning Supplies', status: 'rejected', time: '6 hours ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.firstName || user?.firstName}!
            </h1>
            <p className="text-green-100 text-lg">
              Storekeeper Dashboard - {profile?.departmentName || 'Your Department'}
            </p>
            <p className="text-green-200 text-sm mt-1">
              Manage inventory, staff, and department operations
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              <Package className="h-3 w-3 mr-1" />
              Storekeeper
            </Badge>
            <p className="text-sm text-green-200">
              Department: {profile?.departmentName || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
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
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group" onClick={action.action}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Requests
                </CardTitle>
                <CardDescription>
                  Latest staff requests requiring your attention
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/requests')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-sm">{request.staff}</p>
                      <p className="text-xs text-gray-500">{request.item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                      {request.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{request.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Department Overview
            </CardTitle>
            <CardDescription>
              Your department statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Staff</span>
                </div>
                <span className="text-lg font-bold text-blue-600">45</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Inventory Items</span>
                </div>
                <span className="text-lg font-bold text-green-600">1,247</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Pending Requests</span>
                </div>
                <span className="text-lg font-bold text-orange-600">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Low Stock</span>
                </div>
                <span className="text-lg font-bold text-red-600">8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Reports
          </CardTitle>
          <CardDescription>
            Generate and view department reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/inventory-summary-report')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="font-medium">Inventory Summary</span>
              <span className="text-xs text-gray-500">View inventory reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/user-activity-report')}
            >
              <Activity className="h-6 w-6" />
              <span className="font-medium">User Activity</span>
              <span className="text-xs text-gray-500">Track user activities</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/transaction-report')}
            >
              <FileText className="h-6 w-6" />
              <span className="font-medium">Transaction Report</span>
              <span className="text-xs text-gray-500">View transactions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
