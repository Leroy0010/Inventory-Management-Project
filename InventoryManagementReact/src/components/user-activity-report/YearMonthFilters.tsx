import { SelectField } from '@/components/common/SelectField';

interface YearMonthFiltersProps {
    year: string;
    month: string;
    onYearChange: (value: string) => void;
    onMonthChange: (value: string) => void;
    yearError?: string;
    monthError?: string;
}

const MONTHS = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

export function YearMonthFilters({
    year,
    month,
    onYearChange,
    onMonthChange,
    yearError,
    monthError,
}: YearMonthFiltersProps) {
    // Generate years (current year - 10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);

    const yearOptions = years.map((y) => ({
        value: y.toString(),
        label: y.toString(),
    }));

    return (
        <>
            <SelectField
                label="Year"
                value={year}
                onValueChange={onYearChange}
                options={yearOptions}
                placeholder="Select year"
                error={yearError}
                required
                htmlFor="year"
            />

            <SelectField
                label="Month (Optional)"
                value={month}
                onValueChange={onMonthChange}
                options={MONTHS}
                placeholder="Select month"
                error={monthError}
                htmlFor="month"
            />
        </>
    );
}
