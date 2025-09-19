import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { useDepartmentQueries } from '@/hooks/queries/useDepartments';
import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import {
    addDepartmentSchema,
    type AddDepartmentFormData,
} from './DepartmentFormValidation';
import { DepartmentFormFields } from './DepartmentFormFields';
import { DepartmentFormActions } from './DepartmentFormActions';
import { DepartmentFormErrorAlert } from './DepartmentFormErrorAlert';
import { DepartmentFormSuccessAlert } from './DepartmentFormSuccessAlert';

interface AddDepartmentFormProps {
    className?: string;
    onSuccess?: () => void;
}

export default function AddDepartmentForm({
    className,
    onSuccess,
}: AddDepartmentFormProps) {
    const { createDepartmentMutation } = useDepartmentQueries();
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const methods = useForm<AddDepartmentFormData>({
        resolver: zodResolver(addDepartmentSchema),
        mode: 'onChange',
    });

    const {
        handleSubmit,
        formState: { isSubmitting, isValid, isDirty },
        reset,
        watch,
    } = methods;

    const watchedValues = watch();

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const onSubmit = async (data: AddDepartmentFormData) => {
        try {
            await createDepartmentMutation.mutateAsync({
                name: data.name.trim(),
                description: data.description?.trim() || undefined,
            });

            // Show success state
            setShowSuccess(true);

            // Reset form after a brief delay
            setTimeout(() => {
                reset();
                onSuccess?.();
            }, 1000);
        } catch (error) {
            // Error is handled by the mutation's onError callback
            console.error('Failed to create department:', error);
        }
    };

    const handleReset = () => {
        reset();
        setShowSuccess(false);
    };

    const isFormValid = isValid && isDirty;
    const isLoading = isSubmitting || createDepartmentMutation.isPending;

    return (
        <Card className={`${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Add New Department
                </CardTitle>
                <CardDescription>
                    Create a new department in your organization. All fields
                    marked with * are required.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Success Alert */}
                        <DepartmentFormSuccessAlert show={showSuccess} />

                        {/* Error Alert */}
                        <DepartmentFormErrorAlert
                            error={createDepartmentMutation.error}
                        />

                        {/* Form Fields */}
                        <DepartmentFormFields
                            watchedValues={watchedValues}
                            isLoading={isLoading}
                        />

                        {/* Form Actions */}
                        <DepartmentFormActions
                            isLoading={isLoading}
                            onReset={handleReset}
                        />
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
