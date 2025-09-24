import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { useUserEmailsAndIds } from '@/hooks/queries/useUser';
import { useToast } from '@/hooks/useToast';
import type { UserReportFilters } from '@/types/userReport';

const filterSchema = z.object({
    userId: z.number().optional(),
    year: z.number().min(2000).max(2100).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.enum(['itemId', 'itemName', 'quantityReceived']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface UserReportFiltersProps {
    onApplyFilters: (filters: UserReportFilters) => void;
    onClearFilters: () => void;
    isLoading?: boolean;
}

const SORT_OPTIONS = [
    { value: 'itemId', label: 'Item ID' },
    { value: 'itemName', label: 'Item Name' },
    { value: 'quantityReceived', label: 'Quantity Received' },
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
    const { userEmailsAndIdsQuery } = useUserEmailsAndIds();
    const { toast } = useToast();

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
            userId: undefined,
            year: new Date().getFullYear(),
            startDate: undefined,
            endDate: undefined,
            sortBy: 'itemName',
            sortOrder: 'asc',
        },
    });

    const watchedValues = watch();

    // Convert user emails and IDs to combobox options
    const userOptions: ComboboxOption[] = [
        ...(userEmailsAndIdsQuery.data?.map((user) => ({
            value: user.id.toString(),
            label: user.email,
        })) || []),
    ];

    // Generate years (current year - 10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);

    const handleApplyFilters = (data: FilterFormData) => {
        // Validate that at least userId and either year or date range is provided
        if (!data.userId) {
            toast({
                title: 'Validation Error',
                description: 'Please select a user',
                variant: 'destructive',
            });
            return;
        }

        if (!data.year && (!data.startDate || !data.endDate)) {
            toast({
                title: 'Validation Error',
                description: 'Please select either a year or a date range',
                variant: 'destructive',
            });
            return;
        }

        const filters: UserReportFilters = {
            userId: data.userId || undefined,
            year: data.year,
            startDate: data.startDate,
            endDate: data.endDate,
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

    const handleDateRangeChange = (
        startDate: Date | undefined,
        endDate: Date | undefined
    ) => {
        setValue('startDate', startDate?.toISOString().split('T')[0]);
        setValue('endDate', endDate?.toISOString().split('T')[0]);
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
                <form
                    onSubmit={handleSubmit(handleApplyFilters)}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* User Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="userId">Select User</Label>
                            <Combobox
                                options={userOptions}
                                value={watchedValues.userId?.toString() || ''}
                                onValueChange={(value) =>
                                    setValue(
                                        'userId',
                                        value ? parseInt(value) : undefined
                                    )
                                }
                                placeholder="Select user..."
                                searchPlaceholder="Search by email..."
                                emptyText="No users found"
                                width="w-full"
                                disabled={userEmailsAndIdsQuery.isLoading}
                            />
                            {errors.userId && (
                                <p className="text-sm text-red-600">
                                    {errors.userId.message}
                                </p>
                            )}
                        </div>

                        {/* Year Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Select
                                value={watchedValues.year?.toString() || ''}
                                onValueChange={(value) =>
                                    setValue(
                                        'year',
                                        value ? parseInt(value) : undefined
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={year.toString()}
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.year && (
                                <p className="text-sm text-red-600">
                                    {errors.year.message}
                                </p>
                            )}
                        </div>

                        {/* Date Range Selection */}
                        <div className="space-y-2">
                            <Label>Date Range (Alternative to Year)</Label>
                            <DateRangePicker
                                startDate={
                                    watchedValues.startDate
                                        ? new Date(watchedValues.startDate)
                                        : undefined
                                }
                                endDate={
                                    watchedValues.endDate
                                        ? new Date(watchedValues.endDate)
                                        : undefined
                                }
                                onStartDateChange={(date) =>
                                    handleDateRangeChange(
                                        date,
                                        watchedValues.endDate
                                            ? new Date(watchedValues.endDate)
                                            : undefined
                                    )
                                }
                                onEndDateChange={(date) =>
                                    handleDateRangeChange(
                                        watchedValues.startDate
                                            ? new Date(watchedValues.startDate)
                                            : undefined,
                                        date
                                    )
                                }
                            />
                            {errors.startDate && (
                                <p className="text-sm text-red-600">
                                    {errors.startDate.message}
                                </p>
                            )}
                            {errors.endDate && (
                                <p className="text-sm text-red-600">
                                    {errors.endDate.message}
                                </p>
                            )}
                        </div>

                        {/* Sort By */}
                        <div className="space-y-2">
                            <Label htmlFor="sortBy">Sort By</Label>
                            <Select
                                value={watchedValues.sortBy || ''}
                                onValueChange={(value) =>
                                    setValue(
                                        'sortBy',
                                        value as
                                            | 'itemId'
                                            | 'itemName'
                                            | 'quantityReceived'
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sort field" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.sortBy && (
                                <p className="text-sm text-red-600">
                                    {errors.sortBy.message}
                                </p>
                            )}
                        </div>

                        {/* Sort Order */}
                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">Sort Order</Label>
                            <Select
                                value={watchedValues.sortOrder || ''}
                                onValueChange={(value) =>
                                    setValue(
                                        'sortOrder',
                                        value as 'asc' | 'desc'
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sort order" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_ORDER_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
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
                                <p className="text-sm text-red-600">
                                    {errors.sortOrder.message}
                                </p>
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
