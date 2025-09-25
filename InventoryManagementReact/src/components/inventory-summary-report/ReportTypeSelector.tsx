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
import type { InventorySummaryType } from '@/types/inventorySummaryReport';

interface ReportTypeSelectorProps {
    form: UseFormReturn<any>;
}

export function ReportTypeSelector({ form }: ReportTypeSelectorProps) {
    return (
        <FormField
            control={form.control}
            name="inventorySummaryType"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Report Type</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="BY_QUANTITY">
                                By Quantity
                            </SelectItem>
                            <SelectItem value="BY_VALUE">By Value</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
