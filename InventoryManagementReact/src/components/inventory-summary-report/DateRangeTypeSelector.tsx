import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { UseFormReturn } from 'react-hook-form';

interface DateRangeTypeSelectorProps {
    form: UseFormReturn<any>;
    onTypeChange: (type: 'year' | 'yearRange' | 'custom') => void;
}

export function DateRangeTypeSelector({
    form,
    onTypeChange,
}: DateRangeTypeSelectorProps) {
    return (
        <FormField
            control={form.control}
            name="dateRange.type"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Date Range Type</FormLabel>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            onTypeChange(
                                value as 'year' | 'yearRange' | 'custom'
                            );
                        }}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select date range type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="year">Single Year</SelectItem>
                            <SelectItem value="yearRange">
                                Year Range
                            </SelectItem>
                            <SelectItem value="custom">
                                Custom Date Range
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
