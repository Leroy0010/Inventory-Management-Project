import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateOffice } from '@/hooks/queries/useOffice';
import { useNavigate } from 'react-router-dom';
import {
    addOfficeSchema,
    type AddOfficeFormData,
} from './OfficeFormValidation';
import { OfficeFormFields } from './OfficeFormFields';
import { OfficeFormActions } from './OfficeFormActions';
import { OfficeFormErrorAlert } from './OfficeFormErrorAlert';

interface AddOfficeFormProps {
    classname?: string;
}

export default function AddOfficeForm({ classname }: AddOfficeFormProps) {
    const navigate = useNavigate();
    const createOfficeMutation = useCreateOffice();

    const methods = useForm<AddOfficeFormData>({
        resolver: zodResolver(addOfficeSchema),
        defaultValues: {
            name: '',
            location: '',
            description: '',
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: AddOfficeFormData) => {
        try {
            await createOfficeMutation.mutateAsync(data);
            navigate('/office');
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    return (
        <Card className={`${classname}`}>
            <CardContent>
                <FormProvider {...methods}>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Error Alert */}
                        <OfficeFormErrorAlert
                            error={createOfficeMutation.error}
                        />

                        {/* Form Fields */}
                        <OfficeFormFields />

                        {/* Form Actions */}
                        <OfficeFormActions
                            isSubmitting={
                                isSubmitting || createOfficeMutation.isPending
                            }
                        />
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
