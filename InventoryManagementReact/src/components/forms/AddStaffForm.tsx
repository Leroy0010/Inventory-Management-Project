import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useOfficeQueries } from '@/hooks/queries/useOffice';
import { useUserQueries } from '@/hooks/queries/useUser';
import { toast } from 'sonner';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';

interface AddStaffFormProps {
    className?: string;
}
const addStaffSchema = z.object({
    email: z.email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    office: z.string().min(1, 'Office is required'),
});

type AddStaffFormData = z.infer<typeof addStaffSchema>;

export default function AddStaffForm({ className }: AddStaffFormProps) {
    const [value, setValue] = useState('');

    // Queries
    const { officeNamesQuery } = useOfficeQueries();
    const { createStaffMutation } = useUserQueries();

    // Convert offices to combobox options
    const officeOptions: ComboboxOption[] = officeNamesQuery.data?.map((office) => ({
        value: office,
        label: office,
    })) || [];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue: setFormValue,
        reset,
    } = useForm<AddStaffFormData>({
        resolver: zodResolver(addStaffSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            office: '',
        },
    });

    // Handle form submission
    const onSubmit = async (data: AddStaffFormData) => {
        try {
            await createStaffMutation.mutateAsync({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                officeName: data.office,
            });
            reset();
            setValue('');
            toast.success('Staff member created successfully!');
        } catch (error) {
            console.error('Error creating staff member:', error);
        }
    };

    return (
        <Card className={className}>
            <CardContent>
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter staff email"
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
                        <Label htmlFor="office" className="mb-1">
                            Office
                        </Label>
                        <Combobox
                            options={officeOptions}
                            value={value}
                            onValueChange={(selectedValue) => {
                                setValue(selectedValue);
                                setFormValue('office', selectedValue);
                            }}
                            placeholder="Select office..."
                            searchPlaceholder="Search office..."
                            emptyText="No office found"
                            width="w-full"
                        />
                        {errors.office && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.office.message}
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Staff'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
