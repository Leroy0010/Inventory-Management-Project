import { Button } from '../ui/button';
import { X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { StaffFilters } from '@/types/staff';
import type { Office } from '@/types/office';

interface FilterPanelProps {
    clearFilters: () => void;
    filters: StaffFilters;
    handleStatusFilter: (value: string) => void;
    handleOfficeFilter: (value: string) => void;
    offices: Office[];
}

export default function FilterPanel({
    clearFilters,
    filters,
    handleStatusFilter,
    handleOfficeFilter,
    offices,
}: FilterPanelProps) {
    return (
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
                    <label className="text-sm font-medium mb-2 block">
                        Status
                    </label>
                    <Select
                        value={
                            filters.active === undefined
                                ? 'all'
                                : filters.active
                                  ? 'active'
                                  : 'inactive'
                        }
                        onValueChange={handleStatusFilter}
                    >
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
                    <label className="text-sm font-medium mb-2 block">
                        Office
                    </label>
                    <Select
                        value={filters.officeName || 'all'}
                        onValueChange={handleOfficeFilter}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Offices</SelectItem>
                            {offices.map((office) => (
                                <SelectItem key={office.id} value={office.name}>
                                    {office.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
