import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, Building, FileText, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Inventory Items',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      description: 'Items in stock'
    },
    {
      title: 'Active Staff',
      value: '45',
      change: '+3',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Team members'
    },
    {
      title: 'Offices',
      value: '8',
      change: '0',
      changeType: 'neutral' as const,
      icon: Building,
      description: 'Active locations'
    },
    {
      title: 'Pending Requests',
      value: '23',
      change: '-5',
      changeType: 'negative' as const,
      icon: FileText,
      description: 'Awaiting approval'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Low stock alert: Office supplies running low',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'New inventory batch received',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Monthly report generated successfully',
      time: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your inventory.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center gap-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {stat.changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                  {stat.changeType === 'negative' && <TrendingUp className="h-3 w-3 rotate-180" />}
                  {stat.change}
                </span>
                {' '}from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your inventory system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'info' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {alert.message}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">Add Inventory Item</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Add Staff Member</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Generate Report</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">View Alerts</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
