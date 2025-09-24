import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { AddStorekeeperFormData } from './StorekeeperFormValidation';

interface StorekeeperFormFieldsProps {
    departments: string[];
    value: string;
    setValue: (value: string) => void;
}

export function StorekeeperFormFields({
    departments,
    value,
    setValue,
}: StorekeeperFormFieldsProps) {
    const {
        register,
        formState: { errors },
        setValue: setFormValue,
    } = useFormContext<AddStorekeeperFormData>();

    // Convert departments to combobox options
    const departmentOptions: ComboboxOption[] = departments.map((dept) => ({
        value: dept,
        label: dept,
    }));

    return (
        <>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register('email')}
                    className="mt-1"
                />
                {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    {...register('firstName')}
                    className="mt-1"
                />
                {errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.firstName.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter last name"
                    {...register('lastName')}
                    className="mt-1"
                />
                {errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.lastName.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="departmentName" className="mb-1">
                    Department
                </Label>
                <Combobox
                    options={departmentOptions}
                    value={value}
                    onValueChange={(selectedValue) => {
                        setValue(selectedValue);
                        setFormValue('departmentName', selectedValue);
                    }}
                    placeholder="Select department name..."
                    searchPlaceholder="Search department name..."
                    emptyText="No department found"
                    width="w-[200px]"
                />
                {errors.departmentName && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.departmentName.message}
                    </p>
                )}
            </div>
        </>
    );
}
