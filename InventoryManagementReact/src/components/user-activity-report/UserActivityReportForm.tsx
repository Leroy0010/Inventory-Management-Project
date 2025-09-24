import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
    UserActivityReportFilters,
    UserRole,
} from '@/types/userActivityReport';
import { useOffices } from '@/hooks/queries/useOffice';
import { TimePeriodSelector } from './TimePeriodSelector';
import { FilterOptions } from './FilterOptions';
import { ReportActions } from './ReportActions';

interface UserActivityReportFormProps {
    onGenerate: (filters: UserActivityReportFilters) => void;
    onExport?: (filters: UserActivityReportFilters) => void;
    isLoading?: boolean;
    className?: string;
}

const USER_ROLES: { value: UserRole; label: string }[] = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'STOREKEEPER', label: 'Storekeeper' },
    { value: 'STAFF', label: 'Staff' },
];

export function UserActivityReportForm({
    onGenerate,
    onExport,
    isLoading = false,
    className,
}: UserActivityReportFormProps) {
    const [filters, setFilters] = useState<UserActivityReportFilters>({
        timePeriod: {
            type: 'year',
            year: new Date().getFullYear(),
        },
        includeSubmissions: true,
        includeApprovals: true,
        includeRejections: true,
        includeFulfillments: true,
        activeOnly: false,
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    // Fetch offices data
    const { data: offices = [], isLoading: officesLoading } = useOffices();

    // Convert offices to combobox options
    const officeOptions = [
        { value: 'all', label: 'All Offices' },
        ...offices.map((office) => ({
            value: office.id.toString(),
            label: office.name,
        })),
    ];

    // Convert roles to combobox options
    const roleOptions = [
        { value: 'all', label: 'All Roles' },
        ...USER_ROLES.map((role) => ({
            value: role.value,
            label: role.label,
        })),
    ];

    const handleTimePeriodChange = (type: 'year' | 'dateRange') => {
        setFilters((prev) => ({
            ...prev,
            timePeriod: {
                type,
                year: type === 'year' ? new Date().getFullYear() : undefined,
                startDate:
                    type === 'dateRange'
                        ? undefined
                        : prev.timePeriod.startDate,
                endDate:
                    type === 'dateRange' ? undefined : prev.timePeriod.endDate,
            },
        }));
    };

    const handleYearChange = (year: number) => {
        setFilters((prev) => ({
            ...prev,
            timePeriod: {
                ...prev.timePeriod,
                year,
            },
        }));
    };

    const handleDateRangeChange = (
        startDate: Date | undefined,
        endDate: Date | undefined
    ) => {
        setFilters((prev) => ({
            ...prev,
            timePeriod: {
                ...prev.timePeriod,
                startDate: startDate
                    ? startDate.toISOString().split('T')[0]
                    : undefined,
                endDate: endDate
                    ? endDate.toISOString().split('T')[0]
                    : undefined,
            },
        }));
    };

    const handleFilterChange = (
        field: keyof UserActivityReportFilters,
        value: any
    ) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleActivityTypeChange = (
        type: keyof Pick<
            UserActivityReportFilters,
            | 'includeSubmissions'
            | 'includeApprovals'
            | 'includeRejections'
            | 'includeFulfillments'
        >,
        checked: boolean
    ) => {
        setFilters((prev) => ({
            ...prev,
            [type]: checked,
        }));
    };

    const handleGenerate = () => {
        onGenerate(filters);
    };

    const handleExport = () => {
        if (onExport) {
            onExport(filters);
        }
    };

    const isFormValid = () => {
        if (filters.timePeriod.type === 'year') {
            return filters.timePeriod.year !== undefined;
        } else {
            return filters.timePeriod.startDate && filters.timePeriod.endDate;
        }
    };

    return (
        <div className={cn('space-y-6', className)}>
            {/* Time Period Selection */}
            <TimePeriodSelector
                timePeriod={filters.timePeriod}
                onTimePeriodChange={handleTimePeriodChange}
                onYearChange={handleYearChange}
                onDateRangeChange={handleDateRangeChange}
            />

            {/* Advanced Filters Toggle */}
            <Card>
                <CardHeader>
                    <Button
                        variant="ghost"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full justify-between p-0 h-auto"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            <span className="text-base font-medium">
                                Advanced Filters
                            </span>
                        </div>
                        {showAdvanced ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                    <CardDescription>
                        {showAdvanced
                            ? 'Refine your report with additional filters'
                            : 'Click to show additional filtering options'}
                    </CardDescription>
                </CardHeader>
                {showAdvanced && (
                    <CardContent>
                        <FilterOptions
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onActivityTypeChange={handleActivityTypeChange}
                            officeOptions={officeOptions}
                            roleOptions={roleOptions}
                        />
                    </CardContent>
                )}
            </Card>

            {/* Action Buttons */}
            <ReportActions
                onGenerate={handleGenerate}
                onExport={onExport ? handleExport : undefined}
                isLoading={isLoading}
                isFormValid={isFormValid() as boolean}
                canExport={!!onExport}
                hasData={false} // This will be updated by parent component
            />
        </div>
    );
}
