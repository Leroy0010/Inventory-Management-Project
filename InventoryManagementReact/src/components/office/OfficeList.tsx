import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Building, Users } from 'lucide-react';
import { OfficeCard } from './OfficeCard';
import type { Office, OfficeFilters } from '@/types/office';
import ListLoading from './ListLoading';
import ListFilter from './ListFilter';

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
    return <ListLoading /> ;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <ListFilter clearFilters={clearFilters} filters={filters} handleSearchChange={handleSearchChange} setShowFilters={setShowFilters} showFilters={showFilters} />
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
