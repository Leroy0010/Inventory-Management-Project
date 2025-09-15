import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} from 'lucide-react';

// Icon mapping for dynamic icons
const iconMap = {
  Package,
  ShoppingCart,
  FileText,
  TrendingUp,
  AlertTriangle,
  Plus,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} as const;
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useGetProfile } from '@/hooks/queries/useProfile';
import { useUnreadCount } from '@/hooks/queries/useNotification';
import { useStaffDashboard } from '@/hooks/queries/useDashboard';
import StaffWelcome from '../staff-dashboard/StaffWelcome';
import StaffStatsGrid from '../staff-dashboard/StaffStatsGrid';

export function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: profile } = useGetProfile();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: dashboardData, isLoading, error } = useStaffDashboard();

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
  const quickActions = dashboardData?.quickActions || [];
  const stats = dashboardData?.stats || [];
  const cartItems = dashboardData?.cartItems || [];
  const cartTotal = dashboardData?.cartTotal || 0;

  const recentRequests = [
    { id: 1, item: 'Office Supplies', status: 'approved', date: '2 days ago', quantity: 5 },
    { id: 2, item: 'IT Equipment', status: 'pending', date: '1 day ago', quantity: 2 },
    { id: 3, item: 'Cleaning Supplies', status: 'rejected', date: '3 days ago', quantity: 10 },
  ];

  // Cart items are now fetched from backend data

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

  // Cart total is now provided by backend

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <StaffWelcome profile={profile} user={user} />

      {/* Stats Grid */}
      {stats.length > 0 && (
        <StaffStatsGrid stats={stats}  />
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group" onClick={action.action}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                    {(() => {
                      const IconComponent = iconMap[action.icon as keyof typeof iconMap];
                      return IconComponent ? <IconComponent className="h-6 w-6 text-white" /> : null;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Requests
                </CardTitle>
                <CardDescription>
                  Your latest item requests
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/my-requests')}>
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
                      <p className="font-medium text-sm">{request.item}</p>
                      <p className="text-xs text-gray-500">Qty: {request.quantity} • {request.date}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shopping Cart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Cart
                </CardTitle>
                <CardDescription>
                  Items ready for checkout
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>
                View Cart
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Items:</span>
                      <span className="font-bold text-lg">{cartTotal}</span>
                    </div>
                    <Button className="w-full mt-2" onClick={() => navigate('/cart')}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Your cart is empty</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => navigate('/inventory-items')}
                  >
                    Browse Items
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Search and Browse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Search & Browse
          </CardTitle>
          <CardDescription>
            Find items quickly and start shopping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/inventory-items')}
            >
              <Package className="h-6 w-6" />
              <span className="font-medium">Browse All Items</span>
              <span className="text-xs text-gray-500">View complete inventory</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/inventory-items?category=office-supplies')}
            >
              <FileText className="h-6 w-6" />
              <span className="font-medium">Office Supplies</span>
              <span className="text-xs text-gray-500">Pens, papers, notebooks</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/inventory?category=it-equipment')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="font-medium">IT Equipment</span>
              <span className="text-xs text-gray-500">Computers, accessories</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Summary */}
      {unreadCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-800">
                  You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-orange-600">
                  Check your notifications for updates on your requests
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/notifications')}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                View Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
