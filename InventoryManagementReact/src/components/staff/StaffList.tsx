import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Users, } from 'lucide-react';
import { StaffCard } from './StaffCard';
import { useOffices } from '@/hooks/queries/useOffice';
import type { Staff, StaffFilters } from '@/types/staff';
import FilterPanel from './FilterPanel';
import Stats from './Stats';
import ListLoading from './ListLoading';

interface StaffListProps {
    staff: Staff[];
    isLoading?: boolean;
    onEdit?: (staff: Staff) => void;
    onView?: (staff: Staff) => void;
}

export function StaffList({
    staff,
    isLoading,
    onEdit,
    onView,
}: StaffListProps) {
    const [filters, setFilters] = useState<StaffFilters>({});
    const [showFilters, setShowFilters] = useState(false);

    const { data: offices = [] } = useOffices();

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value || undefined }));
    };

    const handleStatusFilter = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            active: value === 'all' ? undefined : value === 'active',
        }));
    };

    const handleOfficeFilter = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            officeName: value === 'all' ? undefined : value,
        }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    const activeCount = staff.filter((s) => s.active).length;
    const inactiveCount = staff.filter((s) => !s.active).length;

    if (isLoading) {
        return (
            <ListLoading />
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
                <FilterPanel
                    clearFilters={clearFilters}
                    filters={filters}
                    handleOfficeFilter={handleOfficeFilter}
                    handleStatusFilter={handleStatusFilter}
                    offices={offices}
                />
            )}

            {/* Stats */}
            <Stats staff={staff} activeCount={activeCount} inactiveCount={inactiveCount} />

            {/* Staff Grid */}
            {staff.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No staff members found
                    </h3>
                    <p className="text-gray-500">
                        {Object.keys(filters).length > 0
                            ? 'Try adjusting your filters to see more results.'
                            : 'Add your first staff member to get started.'}
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
