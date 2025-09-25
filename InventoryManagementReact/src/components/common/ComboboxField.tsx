import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { FormField } from './FormField';

interface ComboboxFieldProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: ComboboxOption[];
    placeholder?: string;
    error?: string;
    required?: boolean;
    className?: string;
    htmlFor?: string;
}

export function ComboboxField({
    label,
    value,
    onValueChange,
    options,
    placeholder = 'Select option',
    error,
    required = false,
    className,
    htmlFor,
}: ComboboxFieldProps) {
    return (
        <FormField
            label={label}
            htmlFor={htmlFor}
            error={error}
            required={required}
            className={className}
        >
            <Combobox
                options={options}
                value={value}
                onValueChange={onValueChange}
                placeholder={placeholder}
            />
        </FormField>
    );
}
