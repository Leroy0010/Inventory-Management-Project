import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import type {
    TransactionReportRequest,
    StockTransactionType,
} from '@/types/transactionReports';

const filterSchema = z.object({
    itemId: z.number().optional(),
    year: z.number().min(2000).max(2100).optional(),
    month: z.number().min(1).max(12).optional(),
    transactionType: z.enum(['RECEIVED', 'ISSUED']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface TransactionReportFiltersProps {
    onApplyFilters: (filters: TransactionReportRequest) => void;
    onClearFilters: () => void;
    isLoading?: boolean;
}

const MONTHS = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

const TRANSACTION_TYPES: { value: StockTransactionType; label: string }[] = [
    { value: 'RECEIVED', label: 'Received' },
    { value: 'ISSUED', label: 'Issued' },
];

export default function TransactionReportFilters({
    onApplyFilters,
    onClearFilters,
    isLoading = false,
}: TransactionReportFiltersProps) {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Get inventory items for dropdown
    const { itemsQuery } = useInventoryItemQueries();

    // Convert items to combobox options
    const itemOptions: ComboboxOption[] = itemsQuery.data?.map((item) => ({
        value: item.id.toString(),
        label: item.name,
    })) || [];

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
            itemId: undefined,
            year: new Date().getFullYear(),
            month: undefined,
            transactionType: undefined,
            startDate: undefined,
            endDate: undefined,
        },
    });

    const watchedValues = watch();

    // Generate years (current year ± 5)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const handleApplyFilters = (data: FilterFormData) => {
        const filters: TransactionReportRequest = {
            itemId: data.itemId,
            year: data.year,
            month: data.month,
            transactionType: data.transactionType,
            startDate: startDate
                ? startDate.toISOString().split('T')[0]
                : undefined,
            endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
        };

        // Remove undefined values
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
        ) as TransactionReportRequest;

        onApplyFilters(cleanFilters);
    };

    const handleClearFilters = () => {
        reset();
        setStartDate(undefined);
        setEndDate(undefined);
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
                <form
                    onSubmit={handleSubmit(handleApplyFilters)}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Item Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="itemId">Item</Label>
                            <Combobox
                                options={itemOptions}
                                value={watchedValues.itemId?.toString() || ''}
                                onValueChange={(value) =>
                                    setValue(
                                        'itemId',
                                        value ? parseInt(value) : undefined
                                    )
                                }
                                placeholder="Select item"
                                searchPlaceholder="Search items..."
                                emptyText="No items found"
                                width="w-full"
                            />
                            {errors.itemId && (
                                <p className="text-sm text-red-600">
                                    {errors.itemId.message}
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

                        {/* Month Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="month">Month</Label>
                            <Select
                                value={watchedValues.month?.toString() || ''}
                                onValueChange={(value) =>
                                    setValue(
                                        'month',
                                        value ? parseInt(value) : undefined
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((month) => (
                                        <SelectItem
                                            key={month.value}
                                            value={month.value.toString()}
                                        >
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.month && (
                                <p className="text-sm text-red-600">
                                    {errors.month.message}
                                </p>
                            )}
                        </div>

                        {/* Transaction Type */}
                        <div className="space-y-2">
                            <Label htmlFor="transactionType">
                                Transaction Type
                            </Label>
                            <Select
                                value={watchedValues.transactionType || ''}
                                onValueChange={(value) =>
                                    setValue(
                                        'transactionType',
                                        value as StockTransactionType
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TRANSACTION_TYPES.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.transactionType && (
                                <p className="text-sm text-red-600">
                                    {errors.transactionType.message}
                                </p>
                            )}
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <DatePicker
                                date={startDate}
                                onDateChange={setStartDate}
                                placeholder="Pick start date"
                                disabled={isLoading}
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <DatePicker
                                date={endDate}
                                onDateChange={setEndDate}
                                placeholder="Pick end date"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Apply Filters'}
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
