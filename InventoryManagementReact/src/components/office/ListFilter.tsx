import { Search, Filter, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { OfficeFilters } from '@/types/office';

interface ListFilterProps {
    filters: OfficeFilters;
    handleSearchChange: (value: string) => void;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
    clearFilters: () => void;
}

export default function ListFilter({
    filters,
    handleSearchChange,
    setShowFilters,
    showFilters,
    clearFilters
}: ListFilterProps) {
    return (
        <div>
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                        >
                            <X className="w-4 h-4 mr-1" />
                            Clear
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
                </div>
            )}
        </div>
    );
}
