import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePeriodSelectorProps {
    timePeriod: {
        type: 'year' | 'dateRange';
        year?: number;
        startDate?: string;
        endDate?: string;
    };
    onTimePeriodChange: (type: 'year' | 'dateRange') => void;
    onYearChange: (year: number) => void;
    onDateRangeChange: (
        startDate: Date | undefined,
        endDate: Date | undefined
    ) => void;
    className?: string;
}

export function TimePeriodSelector({
    timePeriod,
    onTimePeriodChange,
    onYearChange,
    onDateRangeChange,
    className,
}: TimePeriodSelectorProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <Card className={cn('w-full', className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Time Period
                </CardTitle>
                <CardDescription>
                    Select the time period for the report
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Time Period Type */}
                <div className="space-y-2">
                    <Label htmlFor="timePeriodType">Report Period</Label>
                    <Select
                        value={timePeriod.type}
                        onValueChange={onTimePeriodChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select time period type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="year">Single Year</SelectItem>
                            <SelectItem value="dateRange">
                                Date Range
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Year Selector */}
                {timePeriod.type === 'year' && (
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Select
                            value={timePeriod.year?.toString() || ''}
                            onValueChange={(value) =>
                                onYearChange(parseInt(value))
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
                    </div>
                )}

                {/* Date Range Selector */}
                {timePeriod.type === 'dateRange' && (
                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <DateRangePicker
                            startDate={
                                timePeriod.startDate
                                    ? new Date(timePeriod.startDate)
                                    : undefined
                            }
                            endDate={
                                timePeriod.endDate
                                    ? new Date(timePeriod.endDate)
                                    : undefined
                            }
                            onStartDateChange={(date) =>
                                onDateRangeChange(
                                    date,
                                    timePeriod.endDate
                                        ? new Date(timePeriod.endDate)
                                        : undefined
                                )
                            }
                            onEndDateChange={(date) =>
                                onDateRangeChange(
                                    timePeriod.startDate
                                        ? new Date(timePeriod.startDate)
                                        : undefined,
                                    date
                                )
                            }
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
