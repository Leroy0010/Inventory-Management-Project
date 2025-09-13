import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  User, 
  Mail, 
  Building, 
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserActivityItemDto, UserRole } from '@/types/userActivityReport';

interface UserActivityReportTableProps {
  data: UserActivityItemDto[];
  isLoading?: boolean;
  className?: string;
}

type SortField = 'name' | 'requests' | 'lastActivity' | 'approvalRate' | 'officeName';
type SortOrder = 'ASC' | 'DESC';

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  STOREKEEPER: 'bg-blue-100 text-blue-800',
  STAFF: 'bg-green-100 text-green-800',
};

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export function UserActivityReportTable({
  data,
  isLoading = false,
  className
}: UserActivityReportTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.userName.toLowerCase().includes(term) ||
        user.userEmail.toLowerCase().includes(term) ||
        user.officeName.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.userName.toLowerCase();
          bValue = b.userName.toLowerCase();
          break;
        case 'requests':
          aValue = a.totalRequestsSubmitted;
          bValue = b.totalRequestsSubmitted;
          break;
        case 'lastActivity':
          aValue = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
          bValue = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
          break;
        case 'approvalRate':
          aValue = a.approvalRate;
          bValue = b.approvalRate;
          break;
        case 'officeName':
          aValue = a.officeName.toLowerCase();
          bValue = b.officeName.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'ASC' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
    setPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'ASC' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getActivityIcon = (user: UserActivityItemDto) => {
    if (user.totalRequestsSubmitted === 0) {
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
    if (user.approvalRate > 0.8) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    if (user.approvalRate < 0.5) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-blue-500" />;
  };

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Activity Report
        </CardTitle>
        <CardDescription>
          Detailed breakdown of user activity and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="h-auto p-0 font-semibold"
                  >
                    User
                    {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('officeName')}
                    className="h-auto p-0 font-semibold"
                  >
                    Office
                    {getSortIcon('officeName')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('requests')}
                    className="h-auto p-0 font-semibold"
                  >
                    Requests
                    {getSortIcon('requests')}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('approvalRate')}
                    className="h-auto p-0 font-semibold"
                  >
                    Approval Rate
                    {getSortIcon('approvalRate')}
                  </Button>
                </TableHead>
                <TableHead>Value</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('lastActivity')}
                    className="h-auto p-0 font-semibold"
                  >
                    Last Activity
                    {getSortIcon('lastActivity')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No users found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      {getActivityIcon(user)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{user.userName}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.userEmail}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={cn('text-xs', ROLE_COLORS[user.userRole])}
                        >
                          {user.userRole}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {user.officeName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{user.totalRequestsSubmitted}</div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {user.totalRequestsApproved}
                          </span>
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-red-500" />
                            {user.totalRequestsRejected}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-blue-500" />
                            {user.pendingRequests}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn('text-xs', user.isActive ? STATUS_COLORS.active : STATUS_COLORS.inactive)}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatPercentage(user.approvalRate)}</div>
                        <div className="text-xs text-muted-foreground">
                          Rejection: {formatPercentage(user.rejectionRate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatCurrency(user.totalValueRequested)}</div>
                        <div className="text-xs text-muted-foreground">
                          Approved: {formatCurrency(user.totalValueApproved)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatDate(user.lastActivity)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
