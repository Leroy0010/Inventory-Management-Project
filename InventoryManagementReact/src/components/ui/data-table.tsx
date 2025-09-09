import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Filter,
    Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface Column<T> {
    key: keyof T | string;
    header: string;
    accessor?: (item: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    className?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    error?: string | null;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchFields?: (keyof T)[];
    filterable?: boolean;
    filters?: FilterOption[];
    pagination?: boolean;
    pageSize?: number;
    sortable?: boolean;
    onRowClick?: (item: T) => void;
    onExport?: () => void;
    emptyMessage?: string;
    className?: string;
}

export interface FilterOption {
    key: string;
    label: string;
    options: { value: string; label: string }[];
}

export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
}

// Main DataTable component
export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    isLoading = false,
    error = null,
    searchable = true,
    searchPlaceholder = 'Search...',
    searchFields = [],
    filterable = false,
    filters = [],
    pagination = true,
    pageSize = 10,
    sortable = true,
    onRowClick,
    onExport,
    emptyMessage = 'No data available',
    className,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

    // Filter and search data
    const filteredData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchTerm && searchFields.length > 0) {
            result = result.filter((item) =>
                searchFields.some((field) => {
                    const value = item[field];
                    return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
                })
            );
        }

        // Apply filters
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value) {
                result = result.filter((item) => item[key] === value);
            }
        });

        return result;
    }, [data, searchTerm, searchFields, activeFilters]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortField || !sortable) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortField, sortDirection, sortable]);

    // Paginate data
    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, pageSize, pagination]);

    // Handle sorting
    const handleSort = (field: keyof T) => {
        if (!sortable) return;

        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Handle filter change
    const handleFilterChange = (key: string, value: string) => {
        setActiveFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        setCurrentPage(1);
    };

    // Calculate pagination info
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    // Loading state
    if (isLoading) {
        return (
            <div className={cn('space-y-4', className)}>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="rounded-md border">
                    <div className="p-4">
                        <SkeletonTable rows={5} columns={columns.length} />
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={cn('flex items-center justify-center p-8', className)}>
                <div className="text-center">
                    <p className="text-destructive mb-2">Error loading data</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)}>
            {/* Search and Filters */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {searchable && (
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 w-64"
                            />
                        </div>
                    )}
                    {filterable && filters.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            {filters.map((filter) => (
                                <Select
                                    key={filter.key}
                                    value={activeFilters[filter.key] || ''}
                                    onValueChange={(value) => handleFilterChange(filter.key, value)}
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

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={String(column.key)}
                                    className={cn(
                                        column.className,
                                        sortable && column.sortable !== false && 'cursor-pointer hover:bg-muted/50'
                                    )}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable !== false && handleSort(column.key as keyof T)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.header}</span>
                                        {sortable && column.sortable !== false && sortField === column.key && (
                                            <span className="text-xs">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8">
                                    <p className="text-muted-foreground">{emptyMessage}</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((item, index) => (
                                <TableRow
                                    key={index}
                                    className={cn(
                                        onRowClick && 'cursor-pointer hover:bg-muted/50'
                                    )}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={String(column.key)}
                                            className={column.className}
                                        >
                                            {column.accessor
                                                ? column.accessor(item)
                                                : item[column.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {Math.min((currentPage - 1) * pageSize + 1, filteredData.length)} to{' '}
                        {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={!hasPrevPage}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={!hasPrevPage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={!hasNextPage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={!hasNextPage}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
