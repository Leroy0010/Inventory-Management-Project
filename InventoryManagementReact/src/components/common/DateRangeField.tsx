import { DateRangePicker } from '@/components/ui/date-picker';
import { FormField } from './FormField';

interface DateRangeFieldProps {
    label: string;
    startDate?: Date;
    endDate?: Date;
    onStartDateChange: (date: Date | undefined) => void;
    onEndDateChange: (date: Date | undefined) => void;
    startDateError?: string;
    endDateError?: string;
    required?: boolean;
    className?: string;
}

export function DateRangeField({
    label,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    startDateError,
    endDateError,
    required = false,
    className,
}: DateRangeFieldProps) {
    const hasError = startDateError || endDateError;

    return (
        <FormField
            label={label}
            error={hasError ? startDateError || endDateError : undefined}
            required={required}
            className={className}
        >
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
            />
            {startDateError && (
                <p className="text-sm text-red-600">{startDateError}</p>
            )}
            {endDateError && (
                <p className="text-sm text-red-600">{endDateError}</p>
            )}
        </FormField>
    );
}
