import React, { useState, useMemo } from 'react';
import { Table, TableHeader } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTableHeader, type Column } from './data-table-header';
import { DataTableBody } from './data-table-body';
import { DataTablePagination } from './data-table-pagination';
import { DataTableLoading } from './data-table-loading';
import { DataTableError } from './data-table-error';
import type { FilterOption } from './data-table-filters';

// Types
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
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
        {}
    );

    // Filter and search data
    const filteredData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchTerm && searchFields.length > 0) {
            result = result.filter((item) =>
                searchFields.some((field) => {
                    const value = item[field];
                    return value
                        ?.toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
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
            <DataTableLoading
                columnsCount={columns.length}
                className={className}
            />
        );
    }

    // Error state
    if (error) {
        return <DataTableError error={error} className={className} />;
    }

    return (
        <div className={cn('space-y-4', className)}>
            <DataTableToolbar
                searchable={searchable}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder={searchPlaceholder}
                filterable={filterable}
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onExport={onExport}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <DataTableHeader
                            columns={columns}
                            sortable={sortable}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                        />
                    </TableHeader>
                    <DataTableBody
                        data={paginatedData}
                        columns={columns}
                        onRowClick={onRowClick}
                        emptyMessage={emptyMessage}
                    />
                </Table>
            </div>

            {pagination && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredData.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
