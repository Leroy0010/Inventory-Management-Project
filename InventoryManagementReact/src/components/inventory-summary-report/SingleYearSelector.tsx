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

interface SingleYearSelectorProps {
    form: UseFormReturn<any>;
    show: boolean;
}

export function SingleYearSelector({ form, show }: SingleYearSelectorProps) {
    if (!show) return null;

    return (
        <FormField
            control={form.control}
            name="dateRange.year"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Year</FormLabel>
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
    );
}
