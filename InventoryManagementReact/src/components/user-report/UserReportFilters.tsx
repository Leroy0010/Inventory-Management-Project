import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { useDepartmentQueries } from '@/hooks/queries/useDepartments';
import type { UserReportFilters } from '@/types/userReport';

const filterSchema = z.object({
    search: z.string().optional(),
    year: z.number().min(2000).max(2100).optional(),
    departmentId: z.number().optional(),
    sortBy: z.enum(['inventoryName', 'quantityReceived', 'inventoryCode']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface UserReportFiltersProps {
    onApplyFilters: (filters: UserReportFilters) => void;
    onClearFilters: () => void;
    isLoading?: boolean;
}

const SORT_OPTIONS = [
    { value: 'inventoryName', label: 'Inventory Name' },
    { value: 'quantityReceived', label: 'Quantity Received' },
    { value: 'inventoryCode', label: 'Inventory Code' },
];

const SORT_ORDER_OPTIONS = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
];

export default function UserReportFilters({
    onApplyFilters,
    onClearFilters,
    isLoading = false,
}: UserReportFiltersProps) {
    // Get departments for dropdown
    const { departmentsQuery } = useDepartmentQueries();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<FilterFormData>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            search: '',
            year: new Date().getFullYear(),
            departmentId: undefined,
            sortBy: 'inventoryName',
            sortOrder: 'asc',
        },
    });

    const watchedValues = watch();

    // Generate years (current year ± 5)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const handleApplyFilters = (data: FilterFormData) => {
        const filters: UserReportFilters = {
            search: data.search || undefined,
            year: data.year,
            departmentId: data.departmentId,
            sortBy: data.sortBy,
            sortOrder: data.sortOrder,
        };

        // Remove undefined values
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
        ) as UserReportFilters;

        onApplyFilters(cleanFilters);
    };

    const handleClearFilters = () => {
        reset();
        onClearFilters();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Report Filters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleApplyFilters)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Users</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by name or email..."
                                    className="pl-10"
                                    {...register('search')}
                                />
                            </div>
                            {errors.search && (
                                <p className="text-sm text-red-600">{errors.search.message}</p>
                            )}
                        </div>

                        {/* Year Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Select
                                value={watchedValues.year?.toString() || ''}
                                onValueChange={(value) =>
                                    setValue('year', value ? parseInt(value) : undefined)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.year && (
                                <p className="text-sm text-red-600">{errors.year.message}</p>
                            )}
                        </div>

                        {/* Department Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="departmentId">Department</Label>
                            <Select
                                value={watchedValues.departmentId?.toString() || ''}
                                onValueChange={(value) =>
                                    setValue('departmentId', value ? parseInt(value) : undefined)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departmentsQuery.data?.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id.toString()}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.departmentId && (
                                <p className="text-sm text-red-600">{errors.departmentId.message}</p>
                            )}
                        </div>

                        {/* Sort By */}
                        <div className="space-y-2">
                            <Label htmlFor="sortBy">Sort By</Label>
                            <Select
                                value={watchedValues.sortBy || ''}
                                onValueChange={(value) =>
                                    setValue('sortBy', value as 'inventoryName' | 'quantityReceived' | 'inventoryCode')
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sort field" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.sortBy && (
                                <p className="text-sm text-red-600">{errors.sortBy.message}</p>
                            )}
                        </div>

                        {/* Sort Order */}
                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">Sort Order</Label>
                            <Select
                                value={watchedValues.sortOrder || ''}
                                onValueChange={(value) =>
                                    setValue('sortOrder', value as 'asc' | 'desc')
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sort order" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_ORDER_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                {option.value === 'asc' ? (
                                                    <SortAsc className="h-4 w-4" />
                                                ) : (
                                                    <SortDesc className="h-4 w-4" />
                                                )}
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.sortOrder && (
                                <p className="text-sm text-red-600">{errors.sortOrder.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Apply Filters'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClearFilters}
                            disabled={isLoading}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
