import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { DateRangePicker } from '@/components/ui/date-picker';
import type { UseFormReturn } from 'react-hook-form';

interface CustomDateRangeSelectorProps {
    form: UseFormReturn<any>;
    show: boolean;
}

export function CustomDateRangeSelector({
    form,
    show,
}: CustomDateRangeSelectorProps) {
    if (!show) return null;

    return (
        <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Date Range</FormLabel>
                    <FormControl>
                        <DateRangePicker
                            startDate={field.value?.startDate}
                            endDate={field.value?.endDate}
                            onStartDateChange={(date) => {
                                field.onChange({
                                    ...field.value,
                                    startDate: date,
                                });
                            }}
                            onEndDateChange={(date) => {
                                field.onChange({
                                    ...field.value,
                                    endDate: date,
                                });
                            }}
                            startPlaceholder="Pick start date"
                            endPlaceholder="Pick end date"
                            className="w-full"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
