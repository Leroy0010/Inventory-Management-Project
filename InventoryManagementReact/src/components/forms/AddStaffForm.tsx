import { useState, memo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { useOfficeNames } from '@/hooks/queries/useOffice';
import { useUserQueries } from '@/hooks/queries/useUser';
import { toast } from 'sonner';
import { StaffFormErrorAlert } from './StaffFormErrorAlert';
import { type ComboboxOption } from '@/components/ui/combobox';
import { StaffFormFields } from './StaffFormFields';
import { OfficeSelector } from './OfficeSelector';
import { addStaffSchema, type AddStaffFormData } from './StaffFormValidation';
interface AddStaffFormProps {
    className?: string;
}

const AddStaffForm = memo(function AddStaffForm({
    className,
}: AddStaffFormProps) {
    const [value, setValue] = useState('');

    // Queries
    const officeNames = useOfficeNames();
    const { createStaffMutation } = useUserQueries();

    // Convert offices to combobox options
    const officeOptions: ComboboxOption[] =
        officeNames.data?.map((office) => ({
            value: office,
            label: office,
        })) || [];

    const methods = useForm<AddStaffFormData>({
        resolver: zodResolver(addStaffSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            office: '',
        },
    });

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = methods;

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
            // Error is handled by the mutation's onError callback
            console.error('Failed to create staff member:', error);
        }
    };

    return (
        <Card className={className}>
            <CardContent>
                <FormProvider {...methods}>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <StaffFormErrorAlert
                            error={createStaffMutation.error}
                        />

                        {/* Form Fields */}
                        <StaffFormFields errors={errors} />

                        {/* Office Selector */}
                        <OfficeSelector
                            officeOptions={officeOptions}
                            value={value}
                            onValueChange={setValue}
                            errors={errors}
                        />

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
                </FormProvider>
            </CardContent>
        </Card>
    );
});

export default AddStaffForm;
