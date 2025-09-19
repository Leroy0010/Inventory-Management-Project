import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDepartmentQueries } from '@/hooks/queries/useDepartments';
import { useUserQueries } from '@/hooks/queries/useUser';
import { toast } from 'sonner';
import {
    addStorekeeperSchema,
    type AddStorekeeperFormData,
} from './StorekeeperFormValidation';
import { StorekeeperFormFields } from './StorekeeperFormFields';
import { StorekeeperFormActions } from './StorekeeperFormActions';
import { StorekeeperFormErrorAlert } from './StorekeeperFormErrorAlert';

interface AddStorekeeperFormProps {
    className?: string;
}

export default function AddStorekeeperForm({
    className,
}: AddStorekeeperFormProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    // Queries
    const { departmentsQuery } = useDepartmentQueries();
    const { createStorekeeperMutation } = useUserQueries();

    // Get department names from API
    const departments = departmentsQuery.data?.map((dept) => dept.name) || [];

    const methods = useForm<AddStorekeeperFormData>({
        resolver: zodResolver(addStorekeeperSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            departmentName: '',
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = methods;

    // Handle form submission
    const onSubmit = async (data: AddStorekeeperFormData) => {
        try {
            await createStorekeeperMutation.mutateAsync({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                departmentName: data.departmentName,
                roleName: 'STOREKEEPER',
            });
            reset();
            setValue('');
            toast.success('Storekeeper created successfully!');
        } catch (error) {
            // Error is handled by the mutation's onError callback
            console.error('Failed to create storekeeper:', error);
        }
    };

    return (
        <Card className={`${className}`}>
            <CardContent>
                <FormProvider {...methods}>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Error Alert */}
                        <StorekeeperFormErrorAlert
                            error={createStorekeeperMutation.error}
                        />

                        {/* Form Fields */}
                        <StorekeeperFormFields
                            departments={departments}
                            open={open}
                            setOpen={setOpen}
                            value={value}
                            setValue={setValue}
                        />

                        {/* Form Actions */}
                        <StorekeeperFormActions isSubmitting={isSubmitting} />
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
