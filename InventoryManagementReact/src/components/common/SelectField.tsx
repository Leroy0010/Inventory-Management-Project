import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FormField } from './FormField';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    required?: boolean;
    className?: string;
    htmlFor?: string;
}

export function SelectField({
    label,
    value,
    onValueChange,
    options,
    placeholder = 'Select option',
    error,
    required = false,
    className,
    htmlFor,
}: SelectFieldProps) {
    return (
        <FormField
            label={label}
            htmlFor={htmlFor}
            error={error}
            required={required}
            className={className}
        >
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FormField>
    );
}
