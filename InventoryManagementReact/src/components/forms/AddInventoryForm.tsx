import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { Package, AlertCircle } from 'lucide-react';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';
import { InventoryFormFields } from './InventoryFormFields';
import { InventoryFormActions } from './InventoryFormActions';
import {
    addInventorySchema,
    type AddInventoryFormData,
} from './InventoryFormValidation';

interface AddInventoryFormProps {
    className?: string;
}

export default function AddInventoryForm({ className }: AddInventoryFormProps) {
    // const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Queries
    const { createItemMutation } = useInventoryItemQueries();

    const methods = useForm<AddInventoryFormData>({
        resolver: zodResolver(addInventorySchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            unit: '',
            reorderLevel: 1,
        },
    });

    const {
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
        reset,
    } = methods;

    // Watch form values for real-time validation
    const watchedValues = watch();

    // Handle form submission
    const onSubmit = async (data: AddInventoryFormData) => {
        if (!isValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create inventory item
            await createItemMutation.mutateAsync({
                item: {
                    name: data.name,
                    description: data.description || '',
                    unit: data.unit,
                    reorderLevel: data.reorderLevel,
                },
                imageFile: selectedImage || undefined,
            });

            reset();
            setSelectedImage(null);

            // Navigate to inventory list
            // navigate('/inventory-items');
        } catch (error) {
            // Error is handled by the mutation's onError callback with toast notifications
            console.error('Failed to create inventory item:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle image selection
    const handleImageChange = (file: File | null) => {
        setSelectedImage(file);
        setValue('image', file);
    };

    // Handle image error
    const handleImageError = (error: string) => {
        console.error('Image upload error:', error);
    };

    const handleReset = () => {
        reset();
        setSelectedImage(null);
    };

    return (
        <Card className={className}>
            <CardContent className="p-6">
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="flex items-center space-x-2 mb-6">
                            <Package className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Add New Inventory Item
                            </h3>
                        </div>

                        <FormErrorAlert
                            error={createItemMutation.error}
                            defaultMessage="Failed to create inventory item. Please try again."
                        />

                        {/* Form Fields */}
                        <InventoryFormFields watchedValues={watchedValues} />

                        {/* Image Upload Field */}
                        <div className="space-y-2">
                            <ImageUpload
                                value={selectedImage}
                                onChange={handleImageChange}
                                onError={handleImageError}
                                label="Item Image"
                                description="Upload an image for this inventory item (optional)"
                                maxSize={5}
                                acceptedTypes={[
                                    'image/jpeg',
                                    'image/jpg',
                                    'image/png',
                                    'image/webp',
                                ]}
                                showPreview={true}
                                className={errors.image ? 'border-red-500' : ''}
                            />
                            {errors.image && (
                                <div className="flex items-center space-x-1 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>
                                        {errors?.image?.message as string}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <InventoryFormActions
                            isSubmitting={isSubmitting}
                            onReset={handleReset}
                        />
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
