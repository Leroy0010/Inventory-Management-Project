import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type {
    UseFormRegister,
    FieldErrors,
    UseFormSetValue,
} from 'react-hook-form';

interface EditStaffFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bio?: string;
    office: string;
}

interface StaffEditModalFieldsProps {
    register: UseFormRegister<EditStaffFormData>;
    errors: FieldErrors<EditStaffFormData>;
    setFormValue: UseFormSetValue<EditStaffFormData>;
    office: string;
    setOffice: (value: string) => void;
    officeOptions: ComboboxOption[];
}

export function StaffEditModalFields({
    register,
    errors,
    setFormValue,
    office,
    setOffice,
    officeOptions,
}: StaffEditModalFieldsProps) {
    return (
        <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                        id="firstName"
                        type="text"
                        {...register('firstName')}
                        className={errors.firstName ? 'border-red-500' : ''}
                        placeholder="Enter first name"
                    />
                    {errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                        id="lastName"
                        type="text"
                        {...register('lastName')}
                        className={errors.lastName ? 'border-red-500' : ''}
                        placeholder="Enter last name"
                    />
                    {errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Email */}
            <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                    placeholder="Enter email address"
                />
                {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Phone */}
            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="Enter phone number"
                />
            </div>

            {/* Office */}
            <div>
                <Label htmlFor="officeName">Office</Label>
                <Combobox
                    options={officeOptions}
                    value={office}
                    onValueChange={(selectedValue) => {
                        setOffice(selectedValue);
                        setFormValue('office', selectedValue);
                    }}
                    placeholder="Select office..."
                    searchPlaceholder="Search office..."
                    emptyText="No office found"
                    width="w-full"
                />
            </div>

            {/* Bio */}
            <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    {...register('bio')}
                    placeholder="Enter bio"
                    rows={4}
                    className="resize-none"
                />
            </div>
        </div>
    );
}
