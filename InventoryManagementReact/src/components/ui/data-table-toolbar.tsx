import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { DataTableSearch } from './data-table-search';
import { DataTableFilters, type FilterOption } from './data-table-filters';

interface DataTableToolbarProps {
    searchable: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filterable: boolean;
    filters: FilterOption[];
    activeFilters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    onExport?: () => void;
}

export function DataTableToolbar({
    searchable,
    searchTerm,
    onSearchChange,
    searchPlaceholder,
    filterable,
    filters,
    activeFilters,
    onFilterChange,
    onExport,
}: DataTableToolbarProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                {searchable && (
                    <DataTableSearch
                        searchTerm={searchTerm}
                        onSearchChange={onSearchChange}
                        placeholder={searchPlaceholder}
                    />
                )}
                {filterable && (
                    <DataTableFilters
                        filters={filters}
                        activeFilters={activeFilters}
                        onFilterChange={onFilterChange}
                    />
                )}
            </div>
            <div className="flex items-center space-x-2">
                {onExport && (
                    <Button variant="outline" size="sm" onClick={onExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                )}
            </div>
        </div>
    );
}
