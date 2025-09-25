import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { UseFormReturn } from 'react-hook-form';

interface OfficeFilterProps {
    form: UseFormReturn<any>;
    officeOptions: ComboboxOption[];
    isLoading: boolean;
}

export function OfficeFilter({
    form,
    officeOptions,
    isLoading,
}: OfficeFilterProps) {
    return (
        <FormField
            control={form.control}
            name="officeId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Office Filter</FormLabel>
                    <FormControl>
                        <Combobox
                            options={officeOptions}
                            value={field.value?.toString() || 'all'}
                            onValueChange={(value) => {
                                field.onChange(
                                    value === 'all'
                                        ? undefined
                                        : parseInt(value)
                                );
                            }}
                            placeholder="Select office..."
                            searchPlaceholder="Search offices..."
                            emptyText="No offices found."
                            disabled={isLoading}
                            width="w-full"
                            className="w-max-md w-min-sm"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
