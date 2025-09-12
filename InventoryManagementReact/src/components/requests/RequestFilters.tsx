import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';

interface RequestFiltersProps {
    searchQuery: string;
    statusFilter: string;
    onSearchChange: (query: string) => void;
    onStatusChange: (status: string) => void;
    onClearFilters: () => void;
    onApplyFilters: () => void;
}

const statusOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'FULFILLED', label: 'Fulfilled' },
    { value: 'REJECTED', label: 'Rejected' },
];

export default function RequestFilters({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusChange,
    onClearFilters,
    onApplyFilters,
}: RequestFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search by ID, user, or items..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={statusFilter} onValueChange={onStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        aria-label="Clear all filters"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                    <Button onClick={onApplyFilters}>
                        <Filter className="h-4 w-4 mr-2" />
                        Apply Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
