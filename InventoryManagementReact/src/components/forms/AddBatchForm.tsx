import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '../ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInventoryItems } from '@/hooks/queries/useInventoryItems';
import { useBatches, useCreateBatch } from '@/hooks/queries/useBatch';
import { toast } from 'sonner';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';
import { type ComboboxOption } from '@/components/ui/combobox';
import { addBatchSchema, type AddBatchFormData } from './BatchFormValidation';
import { BatchFormFields } from './BatchFormFields';
import { BatchFormActions } from './BatchFormActions';
import { BatchFormSuccessAlert } from './BatchFormSuccessAlert';
import { Package2 } from 'lucide-react';

interface AddBatchFormProps {
    className?: string;
}

export default function AddBatchForm({ className }: AddBatchFormProps) {
    const [value, setValue] = useState('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    // Queries
    const itemsQuery = useInventoryItems();
    const createBatchMutation = useCreateBatch();

    // Convert items to combobox options
    const itemOptions: ComboboxOption[] =
        itemsQuery.data?.map((item: any) => ({
            value: item.name,
            label: item.name,
        })) || [];

    const methods = useForm<AddBatchFormData>({
        resolver: zodResolver(addBatchSchema),
        mode: 'onChange',
        defaultValues: {
            itemName: '',
            quantity: 1,
            totalPrice: 0,
            supplierName: '',
            invoiceId: '',
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting, isValid, isDirty },
        setValue: setFormValue,
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

    // Handle form submission
    const onSubmit = async (data: AddBatchFormData) => {
        try {
            await createBatchMutation.mutateAsync({
                itemName: data.itemName,
                quantity: data.quantity,
                totalPrice: data.totalPrice,
                supplierName: data.supplierName || undefined,
                invoiceId: data.invoiceId || undefined,
            });

            // Show success state
            setShowSuccess(true);

            // Reset form after a brief delay
            setTimeout(() => {
                reset();
                setValue('');
            }, 1000);
        } catch (error) {
            // Error is handled by the mutation's onError callback
            console.error('Failed to create batch:', error);
        }
    };

    const handleReset = () => {
        reset();
        setValue('');
        setShowSuccess(false);
    };

    const isFormValid = isValid && isDirty;
    const isLoading = isSubmitting || createBatchMutation.isPending;

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package2 className="h-5 w-5" />
                    Add New Batch
                </CardTitle>
                <CardDescription>
                    Create a new inventory batch. All fields marked with * are
                    required.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Success Alert */}
                        <BatchFormSuccessAlert show={showSuccess} />

                        {/* Error Alert */}
                        <FormErrorAlert
                            error={createBatchMutation.error}
                            defaultMessage="Failed to create batch. Please try again."
                        />

                        {/* Form Fields */}
                        <BatchFormFields
                            itemOptions={itemOptions}
                            value={value}
                            setValue={setValue}
                            setFormValue={setFormValue}
                            watchedValues={watchedValues}
                            isLoading={isLoading}
                        />

                        {/* Form Actions */}
                        <BatchFormActions
                            isLoading={isLoading}
                            isFormValid={isFormValid}
                            onReset={handleReset}
                        />
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
