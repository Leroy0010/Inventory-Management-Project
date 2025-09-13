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
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useGetProfile } from '@/hooks/queries/useProfile';
import { useUnreadCount } from '@/hooks/queries/useNotification';

export function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: profile } = useGetProfile();
  const { data: unreadCount = 0 } = useUnreadCount();

  const quickActions = [
    {
      title: 'Browse Inventory',
      description: 'Search and view available items',
      icon: Package,
      action: () => navigate('/inventory'),
      color: 'bg-blue-500',
    },
    {
      title: 'My Cart',
      description: 'View and manage your cart',
      icon: ShoppingCart,
      action: () => navigate('/cart'),
      color: 'bg-green-500',
    },
    {
      title: 'My Requests',
      description: 'View your submitted requests',
      icon: FileText,
      action: () => navigate('/my-requests'),
      color: 'bg-purple-500',
    },
    {
      title: 'Notifications',
      description: 'View your notifications',
      icon: Bell,
      action: () => navigate('/notifications'),
      color: 'bg-orange-500',
    },
  ];

  const stats = [
    {
      title: 'Items in Cart',
      value: '3',
      change: 'Ready for checkout',
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Requests',
      value: '2',
      change: 'Awaiting approval',
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: 'Approved Requests',
      value: '15',
      change: 'This month',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Available Items',
      value: '1,247',
      change: 'In inventory',
      icon: Package,
      color: 'text-purple-600',
    },
  ];

  const recentRequests = [
    { id: 1, item: 'Office Supplies', status: 'approved', date: '2 days ago', quantity: 5 },
    { id: 2, item: 'IT Equipment', status: 'pending', date: '1 day ago', quantity: 2 },
    { id: 3, item: 'Cleaning Supplies', status: 'rejected', date: '3 days ago', quantity: 10 },
  ];

  const cartItems = [
    { id: 1, name: 'Notebooks', quantity: 5, price: 2.50 },
    { id: 2, name: 'Pens', quantity: 10, price: 1.25 },
    { id: 3, name: 'Stapler', quantity: 1, price: 15.00 },
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

  const totalCartValue = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.firstName || user?.firstName}!
            </h1>
            <p className="text-purple-100 text-lg">
              Staff Dashboard - {profile?.officeName || 'Your Office'}
            </p>
            <p className="text-purple-200 text-sm mt-1">
              Browse inventory, manage requests, and track your orders
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              <Package className="h-3 w-3 mr-1" />
              Staff Member
            </Badge>
            <p className="text-sm text-purple-200">
              Office: {profile?.officeName || 'N/A'}
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
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${totalCartValue.toFixed(2)}</span>
                </div>
                <Button className="w-full mt-2" onClick={() => navigate('/cart')}>
                  Proceed to Checkout
                </Button>
              </div>
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
              onClick={() => navigate('/inventory')}
            >
              <Package className="h-6 w-6" />
              <span className="font-medium">Browse All Items</span>
              <span className="text-xs text-gray-500">View complete inventory</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/inventory?category=office-supplies')}
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
