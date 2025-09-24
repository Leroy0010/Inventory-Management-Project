import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useOffices } from '@/hooks/queries/useOffice';
import { useUserEmailsAndIds } from '@/hooks/queries/useUser';
import { useToast } from '@/hooks/useToast';
import type { UserActivityReportFilters as UserActivityReportFiltersType } from '@/types/userActivityReport';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const filterSchema = z.object({
    year: z
        .union([z.string(), z.number()])
        .transform((val) => {
            if (typeof val === 'string') {
                const num = parseInt(val);
                return isNaN(num) ? undefined : num;
            }
            return val;
        })
        .optional(),
    month: z
        .union([z.string(), z.number()])
        .transform((val) => {
            if (typeof val === 'string') {
                const num = parseInt(val);
                return isNaN(num) ? undefined : num;
            }
            return val;
        })
        .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    officeId: z
        .union([z.string(), z.number()])
        .transform((val) => {
            if (typeof val === 'string') {
                const num = parseInt(val);
                return isNaN(num) ? undefined : num;
            }
            return val;
        })
        .optional(),
    userId: z
        .union([z.string(), z.number()])
        .transform((val) => {
            if (typeof val === 'string') {
                const num = parseInt(val);
                return isNaN(num) ? undefined : num;
            }
            return val;
        })
        .optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
    activeOnly: z.boolean().optional(),
});

type FilterFormData = {
    year?: string | number;
    month?: string | number;
    startDate?: string;
    endDate?: string;
    officeId?: string | number;
    userId?: string | number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    activeOnly?: boolean;
};

const SORT_OPTIONS = [
    { value: 'userName', label: 'Name' },
    { value: 'totalRequestsSubmitted', label: 'Requests Submitted' },
    { value: 'totalRequestsApproved', label: 'Requests Approved' },
    { value: 'lastActivity', label: 'Last Activity' },
];

const SORT_ORDER_OPTIONS = [
    { value: 'ASC', label: 'Ascending' },
    { value: 'DESC', label: 'Descending' },
];

interface UserActivityReportFiltersProps {
    onApplyFilters: (filters: UserActivityReportFiltersType) => void;
    onClearFilters: () => void;
    isLoading?: boolean;
}

export default function UserActivityReportFilters({
    onApplyFilters,
    onClearFilters,
    isLoading = false,
}: UserActivityReportFiltersProps) {
    const { data: offices = [], isLoading: officesLoading } = useOffices();
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
            year: new Date().getFullYear().toString(),
            month: undefined,
            startDate: undefined,
            endDate: undefined,
            officeId: undefined,
            userId: undefined,
            sortBy: 'userName',
            sortOrder: 'ASC',
            activeOnly: false,
        },
    });

    const watchedValues = watch();

    // Generate years (current year - 10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);

    // Generate months
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Convert offices to combobox options
    const officeOptions: ComboboxOption[] = [
        { value: '', label: 'All Offices' },
        ...offices.map((office) => ({
            value: office.id.toString(),
            label: office.name,
        })),
    ];

    // Convert users to combobox options
    const userOptions: ComboboxOption[] = [
        { value: '', label: 'All Users' },
        ...(userEmailsAndIdsQuery.data || []).map((user) => ({
            value: user.id.toString(),
            label: `${user.email}`,
        })),
    ];

    const handleApplyFilters = (data: FilterFormData) => {

        // Validate that at least year or date range is provided
        if (!data.year && (!data.startDate || !data.endDate)) {
            toast({
                title: 'Validation Error',
                description: 'Please select either a year or a date range',
                variant: 'destructive',
            });
            return;
        }

        const filters: UserActivityReportFiltersType = {
            timePeriod: {
                type: data.year ? 'year' : 'dateRange',
                year:
                    typeof data.year === 'string'
                        ? parseInt(data.year)
                        : data.year,
                month:
                    typeof data.month === 'string'
                        ? parseInt(data.month)
                        : data.month,
                startDate: data.startDate,
                endDate: data.endDate,
            },
            officeId:
                typeof data.officeId === 'string'
                    ? parseInt(data.officeId)
                    : data.officeId,
            userId:
                typeof data.userId === 'string'
                    ? parseInt(data.userId)
                    : data.userId,
            sortBy: data.sortBy,
            sortOrder: data.sortOrder,
            activeOnly: data.activeOnly ?? false,
        };

        // Remove undefined values
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
        ) as UserActivityReportFiltersType;

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
        <div className="w-full">
            <form
                onSubmit={handleSubmit(handleApplyFilters)}
                className="space-y-6"
            >
                <div className="flex gap-10 flex-wrap">
                    {/* Year Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Select
                            value={watchedValues.year?.toString() || ''}
                            onValueChange={(value) =>
                                setValue('year', value || undefined)
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
                        <Label htmlFor="month">Month (Optional)</Label>
                        <Select
                            value={watchedValues.month?.toString() || ''}
                            onValueChange={(value) =>
                                setValue('month', value || undefined)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem
                                        key={month}
                                        value={month.toString()}
                                    >
                                        {new Date(
                                            2024,
                                            month - 1,
                                            1
                                        ).toLocaleString('default', {
                                            month: 'long',
                                        })}
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

                    {/* Office Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="officeId">Office</Label>
                        <Combobox
                            options={officeOptions}
                            value={watchedValues.officeId?.toString() || ''}
                            onValueChange={(value) =>
                                setValue('officeId', value || undefined)
                            }
                            placeholder="Select office"
                        />
                        {errors.officeId && (
                            <p className="text-sm text-red-600">
                                {errors.officeId.message}
                            </p>
                        )}
                    </div>

                    {/* User Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="userId">User</Label>
                        <Combobox
                            options={userOptions}
                            value={watchedValues.userId?.toString() || ''}
                            onValueChange={(value) =>
                                setValue('userId', value || undefined)
                            }
                            placeholder="Select user"
                        />
                        {errors.userId && (
                            <p className="text-sm text-red-600">
                                {errors.userId.message}
                            </p>
                        )}
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                        <Label htmlFor="sortBy">Sort By</Label>
                        <Select
                            value={watchedValues.sortBy || ''}
                            onValueChange={(value) => setValue('sortBy', value)}
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
                                setValue('sortOrder', value as 'ASC' | 'DESC')
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
                                        {option.label}
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

                    {/* Active Only Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="activeOnly">User Status</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="activeOnly"
                                checked={watchedValues.activeOnly || false}
                                onCheckedChange={(checked) =>
                                    setValue('activeOnly', checked as boolean)
                                }
                            />
                            <Label
                                htmlFor="activeOnly"
                                className="text-sm font-normal"
                            >
                                Show only active users
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? 'Generating...' : 'Generate Report'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClearFilters}
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                </div>
            </form>
        </div>
    );
}
