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

interface CostFlowMethodSelectorProps {
    form: UseFormReturn<any>;
    show: boolean;
}

export function CostFlowMethodSelector({
    form,
    show,
}: CostFlowMethodSelectorProps) {
    if (!show) return null;

    return (
        <FormField
            control={form.control}
            name="costFlowMethod"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Cost Flow Method</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select cost flow method" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="FIFO">
                                FIFO (First-In, First-Out)
                            </SelectItem>
                            <SelectItem value="AVG">
                                Average Weighted
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
