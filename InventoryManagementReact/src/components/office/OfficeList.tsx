import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Building, Users } from 'lucide-react';
import { OfficeCard } from './OfficeCard';
import type { Office, OfficeFilters } from '@/types/office';

interface OfficeListProps {
  offices: Office[];
  isLoading?: boolean;
  onEdit?: (office: Office) => void;
  onView?: (office: Office) => void;
}

export function OfficeList({ offices, isLoading, onEdit, onView}: OfficeListProps) {
  const [filters, setFilters] = useState<OfficeFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const totalStaff = offices.reduce((sum, office) => sum + office.staffCount, 0)

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
              placeholder="Search offices..."
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
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="flex items-center gap-1">
          <Building className="w-3 h-3" />
          Offices: {offices.length}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          Total Staff: {totalStaff}
        </Badge>
      </div>

      {/* Office Grid */}
      {offices.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offices found</h3>
          <p className="text-gray-500">
            {Object.keys(filters).length > 0 
              ? 'Try adjusting your filters to see more results.'
              : 'Add your first office to get started.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map((office) => (
            <OfficeCard
              key={office.id}
              office={office}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
