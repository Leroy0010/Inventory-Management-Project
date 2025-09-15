import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Users, UserCheck, UserX } from 'lucide-react';
import { StaffCard } from './StaffCard';
import { useOffices } from '@/hooks/queries/useOffice';
import type { Staff, StaffFilters } from '@/types/staff';

interface StaffListProps {
  staff: Staff[];
  isLoading?: boolean;
  onEdit?: (staff: Staff) => void;
  onView?: (staff: Staff) => void;
}

export function StaffList({ staff, isLoading, onEdit, onView }: StaffListProps) {
  const [filters, setFilters] = useState<StaffFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: offices = [] } = useOffices();

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      active: value === 'all' ? undefined : value === 'active' 
    }));
  };

  const handleOfficeFilter = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      officeName: value === 'all' ? undefined : value 
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeCount = staff.filter(s => s.active).length;
  const inactiveCount = staff.filter(s => !s.active).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search staff members..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.active === undefined ? 'all' : filters.active ? 'active' : 'inactive'} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Office</label>
              <Select value={filters.officeName || 'all'} onValueChange={handleOfficeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  {offices.map(office => (
                    <SelectItem key={office.id} value={office.name}>
                      {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          Total: {staff.length}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1 text-green-600">
          <UserCheck className="w-3 h-3" />
          Active: {activeCount}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1 text-red-600">
          <UserX className="w-3 h-3" />
          Inactive: {inactiveCount}
        </Badge>
      </div>

      {/* Staff Grid */}
      {staff.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
          <p className="text-gray-500">
            {Object.keys(filters).length > 0 
              ? 'Try adjusting your filters to see more results.'
              : 'Add your first staff member to get started.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((staffMember) => (
            <StaffCard
              key={staffMember.id}
              staff={staffMember}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
