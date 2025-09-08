import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  Activity,
  Package
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  department: string;
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  totalItemsRequested: number;
  totalValueRequested: number;
  lastActivity: string;
  isActive: boolean;
}

interface UserSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRequests: number;
  averageRequestsPerUser: number;
  topRequesters: Array<{
    userName: string;
    requestCount: number;
    totalValue: number;
  }>;
}

export default function UserReport() {
  const { hasPermission } = usePermissions();
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: 'ALL',
    department: 'ALL',
    status: 'ALL',
    search: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUserActivities: UserActivity[] = [
      {
        id: '1',
        userId: 'user-1',
        userName: 'John Smith',
        userRole: 'STAFF',
        department: 'Finance',
        totalRequests: 15,
        approvedRequests: 12,
        rejectedRequests: 1,
        pendingRequests: 2,
        totalItemsRequested: 45,
        totalValueRequested: 1250.50,
        lastActivity: '2024-01-20T14:30:00Z',
        isActive: true
      },
      {
        id: '2',
        userId: 'user-2',
        userName: 'Jane Doe',
        userRole: 'STAFF',
        department: 'IT',
        totalRequests: 8,
        approvedRequests: 7,
        rejectedRequests: 0,
        pendingRequests: 1,
        totalItemsRequested: 22,
        totalValueRequested: 850.25,
        lastActivity: '2024-01-19T16:45:00Z',
        isActive: true
      },
      {
        id: '3',
        userId: 'user-3',
        userName: 'Mike Johnson',
        userRole: 'STAFF',
        department: 'HR',
        totalRequests: 3,
        approvedRequests: 2,
        rejectedRequests: 1,
        pendingRequests: 0,
        totalItemsRequested: 8,
        totalValueRequested: 150.75,
        lastActivity: '2024-01-15T10:20:00Z',
        isActive: false
      },
      {
        id: '4',
        userId: 'user-4',
        userName: 'Sarah Wilson',
        userRole: 'STOREKEEPER',
        department: 'Operations',
        totalRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        pendingRequests: 0,
        totalItemsRequested: 0,
        totalValueRequested: 0,
        lastActivity: '2024-01-20T09:15:00Z',
        isActive: true
      }
    ];

    const mockSummary: UserSummary = {
      totalUsers: 4,
      activeUsers: 3,
      inactiveUsers: 1,
      totalRequests: 26,
      averageRequestsPerUser: 6.5,
      topRequesters: [
        { userName: 'John Smith', requestCount: 15, totalValue: 1250.50 },
        { userName: 'Jane Doe', requestCount: 8, totalValue: 850.25 },
        { userName: 'Mike Johnson', requestCount: 3, totalValue: 150.75 }
      ]
    };

    setUserActivities(mockUserActivities);
    setSummary(mockSummary);
    setLoading(false);
  }, []);

  const filteredUserActivities = userActivities.filter(activity => {
    const matchesRole = filters.role === 'ALL' || activity.userRole === filters.role;
    const matchesDepartment = filters.department === 'ALL' || activity.department === filters.department;
    const matchesStatus = filters.status === 'ALL' || 
                         (filters.status === 'ACTIVE' && activity.isActive) ||
                         (filters.status === 'INACTIVE' && !activity.isActive);
    const matchesSearch = filters.search === '' || 
                         activity.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         activity.department.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesRole && matchesDepartment && matchesStatus && matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'STOREKEEPER': return 'bg-blue-100 text-blue-800';
      case 'STAFF': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalRate = (approved: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((approved / total) * 100);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting user report...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasPermission('VIEW_USER_REPORTS')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view user reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Activity Report</h1>
          <p className="text-muted-foreground">
            Monitor user activity and request patterns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{summary.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{summary.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UserX className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive Users</p>
                  <p className="text-2xl font-bold text-red-600">{summary.inactiveUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Requests/User</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.averageRequestsPerUser}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Requesters */}
      {summary && summary.topRequesters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Requesters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.topRequesters.map((requester, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{requester.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {requester.requestCount} requests
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${requester.totalValue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search users or departments..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STOREKEEPER">Storekeeper</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Departments</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Total Requests</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Rejected</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Approval Rate</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUserActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{activity.userName}</div>
                      <div className="text-sm text-muted-foreground">ID: {activity.userId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(activity.userRole)}>
                      {activity.userRole}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Package className="h-3 w-3" />
                      <span>{activity.totalRequests}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">
                      {activity.approvedRequests}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-red-600 font-medium">
                      {activity.rejectedRequests}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-yellow-600 font-medium">
                      {activity.pendingRequests}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">
                        {getApprovalRate(activity.approvedRequests, activity.totalRequests)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${activity.totalValueRequested.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(activity.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={activity.isActive ? 'default' : 'secondary'}>
                      {activity.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
