import { DateRangeField } from '@/components/common/DateRangeField';

interface DateRangeFiltersProps {
    startDate?: Date;
    endDate?: Date;
    onStartDateChange: (date: Date | undefined) => void;
    onEndDateChange: (date: Date | undefined) => void;
    startDateError?: string;
    endDateError?: string;
}

export function DateRangeFilters({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    startDateError,
    endDateError,
}: DateRangeFiltersProps) {
    return (
        <DateRangeField
            label="Date Range (Alternative to Year)"
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            startDateError={startDateError}
            endDateError={endDateError}
        />
    );
}
