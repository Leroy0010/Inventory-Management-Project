import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

export interface FilterOption {
    key: string;
    label: string;
    options: { value: string; label: string }[];
}

interface DataTableFiltersProps {
    filters: FilterOption[];
    activeFilters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
}

export function DataTableFilters({
    filters,
    activeFilters,
    onFilterChange,
}: DataTableFiltersProps) {
    if (filters.length === 0) return null;

    return (
        <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filters.map((filter) => (
                <Select
                    key={filter.key}
                    value={activeFilters[filter.key] || ''}
                    onValueChange={(value) => onFilterChange(filter.key, value)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        {filter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ))}
        </div>
    );
}
