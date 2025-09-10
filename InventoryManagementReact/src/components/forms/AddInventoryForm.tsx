import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { useDepartmentQueries } from '@/hooks/queries/useDepartments';
// import { useNavigate } from 'react-router-dom';
import { Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddInventoryFormProps {
    className?: string;
}

// Enhanced validation schema
const addInventorySchema = z.object({
    name: z
        .string()
        .min(1, 'Inventory name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be less than 100 characters'),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional(),
    unit: z
        .string()
        .min(1, 'Unit is required')
        .min(2, 'Unit must be at least 2 characters')
        .max(20, 'Unit must be less than 20 characters'),
    reorderLevel: z
        .number()
        .min(1, 'Reorder level must be at least 1')
        .max(10000, 'Reorder level must be less than 10,000'),
    image: z
        .any()
        .optional()
        .refine((file) => {
            if (!file) return true; // Optional field
            if (file instanceof File) {
                const validTypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/webp',
                ];
                return validTypes.includes(file.type);
            }
            return false;
        }, 'Please upload a valid image file (JPEG, PNG, WebP)')
        .refine((file) => {
            if (!file) return true; // Optional field
            if (file instanceof File) {
                return file.size <= 5 * 1024 * 1024; // 5MB max
            }
            return false;
        }, 'Image size must be less than 5MB'),
});

type AddInventoryFormData = z.infer<typeof addInventorySchema>;

export default function AddInventoryForm({ className }: AddInventoryFormProps) {
    // const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Queries
    const { departmentsQuery } = useDepartmentQueries();
    const { createItemMutation } = useInventoryItemQueries();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
        reset,
    } = useForm<AddInventoryFormData>({
        resolver: zodResolver(addInventorySchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            unit: '',
            reorderLevel: 1,
        },
    });

    // Watch form values for real-time validation
    const watchedValues = watch();

    // Handle form submission
    const onSubmit = async (data: AddInventoryFormData) => {
        if (!isValid) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare form data for API
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description || '');
            formData.append('unit', data.unit);
            formData.append('reorderLevel', data.reorderLevel.toString());

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

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

            toast.success('Inventory item created successfully!');
            reset();
            setSelectedImage(null);

            // Navigate to inventory list
            // navigate('/inventory-items');
        } catch (error) {
            console.error('Error creating inventory item:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to create inventory item'
            );
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
        toast.error(error);
    };

    return (
        <Card className={className}>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-6">
                        <Package className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Add New Inventory Item
                        </h3>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Item Name *
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter item name"
                            {...register('name')}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <div className="flex items-center space-x-1 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>{errors.name.message}</span>
                            </div>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Enter item description (optional)"
                            rows={3}
                            {...register('description')}
                            className={
                                errors.description ? 'border-red-500' : ''
                            }
                        />
                        {errors.description && (
                            <div className="flex items-center space-x-1 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>{errors.description.message}</span>
                            </div>
                        )}
                        <p className="text-xs text-gray-500">
                            {watchedValues.description?.length || 0}/500
                            characters
                        </p>
                    </div>

                    {/* Unit and Reorder Level Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Unit Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="unit"
                                className="text-sm font-medium"
                            >
                                Unit *
                            </Label>
                            <Input
                                id="unit"
                                type="text"
                                placeholder="Enter unit"
                                {...register('unit')}
                                className={errors.unit ? 'border-red-500' : ''}
                            />

                            {errors.unit && (
                                <div className="flex items-center space-x-1 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{errors.unit.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Reorder Level Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="reorderLevel"
                                className="text-sm font-medium"
                            >
                                Reorder Level *
                            </Label>
                            <Input
                                id="reorderLevel"
                                type="number"
                                min="1"
                                max="10000"
                                placeholder="Enter reorder level"
                                {...register('reorderLevel', {
                                    valueAsNumber: true,
                                })}
                                className={
                                    errors.reorderLevel ? 'border-red-500' : ''
                                }
                            />
                            {errors.reorderLevel && (
                                <div className="flex items-center space-x-1 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{errors.reorderLevel.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

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
                                <span>{errors?.image?.message as string}</span>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                            {isValid && (
                                <div className="flex items-center space-x-1 text-sm text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Form is valid</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setSelectedImage(null);
                                }}
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    !isValid ||
                                    departmentsQuery.isLoading
                                }
                                className="min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Adding...
                                    </>
                                ) : (
                                    'Add Item'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
