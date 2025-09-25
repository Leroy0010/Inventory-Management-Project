import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { UseFormReturn } from 'react-hook-form';

interface YearRangeSelectorProps {
    form: UseFormReturn<any>;
    show: boolean;
}

export function YearRangeSelector({ form, show }: YearRangeSelectorProps) {
    if (!show) return null;

    return (
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="dateRange.startYear"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Start Year</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="2023"
                                min="2000"
                                max="2100"
                                {...field}
                                onChange={(e) =>
                                    field.onChange(
                                        parseInt(e.target.value) || undefined
                                    )
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="dateRange.endYear"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>End Year</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="2024"
                                min="2000"
                                max="2100"
                                {...field}
                                onChange={(e) =>
                                    field.onChange(
                                        parseInt(e.target.value) || undefined
                                    )
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
