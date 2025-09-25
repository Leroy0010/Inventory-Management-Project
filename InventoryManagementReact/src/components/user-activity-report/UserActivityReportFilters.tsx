import { useOffices } from '@/hooks/queries/useOffice';
import { useUserEmailsAndIds } from '@/hooks/queries/useUser';
import { useToast } from '@/hooks/useToast';
import type { UserActivityReportFilters as UserActivityReportFiltersType } from '@/types/userActivityReport';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FilterActionButtons from './FilterActionButtons';
import StatusFilter from './StatusFilter';
import { YearMonthFilters } from './YearMonthFilters';
import { DateRangeFilters } from './DateRangeFilters';
import { UserOfficeFilters } from './UserOfficeFilters';
import { SortFilters } from './SortFilters';
import { formatDateForAPI } from '@/utils/dateUtils';
import type { ComboboxOption } from '@/components/ui/combobox';

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
        setValue(
            'startDate',
            startDate ? formatDateForAPI(startDate.toISOString()) : ''
        );
        setValue(
            'endDate',
            endDate ? formatDateForAPI(endDate.toISOString()) : ''
        );
    };

    return (
        <div className="w-full">
            <form
                onSubmit={handleSubmit(handleApplyFilters)}
                className="space-y-6"
            >
                <div className="flex gap-10 flex-wrap">
                    {/* Year and Month Selection */}
                    <YearMonthFilters
                        year={watchedValues.year?.toString() || ''}
                        month={watchedValues.month?.toString() || ''}
                        onYearChange={(value) =>
                            setValue('year', value || undefined)
                        }
                        onMonthChange={(value) =>
                            setValue('month', value || undefined)
                        }
                        yearError={errors.year?.message}
                        monthError={errors.month?.message}
                    />

                    {/* Date Range Selection */}
                    <DateRangeFilters
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
                        startDateError={errors.startDate?.message}
                        endDateError={errors.endDate?.message}
                    />

                    {/* Office and User Selection */}
                    <UserOfficeFilters
                        officeId={watchedValues.officeId?.toString() || ''}
                        userId={watchedValues.userId?.toString() || ''}
                        onOfficeChange={(value) =>
                            setValue('officeId', value || undefined)
                        }
                        onUserChange={(value) =>
                            setValue('userId', value || undefined)
                        }
                        officeOptions={officeOptions}
                        userOptions={userOptions}
                        officeError={errors.officeId?.message}
                        userError={errors.userId?.message}
                    />

                    {/* Sort Options */}
                    <SortFilters
                        sortBy={watchedValues.sortBy || ''}
                        sortOrder={watchedValues.sortOrder || ''}
                        onSortByChange={(value) => setValue('sortBy', value)}
                        onSortOrderChange={(value) =>
                            setValue('sortOrder', value as 'ASC' | 'DESC')
                        }
                        sortByError={errors.sortBy?.message}
                        sortOrderError={errors.sortOrder?.message}
                    />

                    {/* Active Only Filter */}
                    <StatusFilter
                        watchedValues={watchedValues}
                        setValue={setValue}
                    />
                </div>

                {/* Action Buttons */}
                <FilterActionButtons
                    isLoading={isLoading}
                    handleClearFilters={handleClearFilters}
                />
            </form>
        </div>
    );
}
