import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { useBatchQueries } from '@/hooks/queries/useBatch';
import { toast } from 'sonner';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const addBatchSchema = z.object({
    itemName: z.string().min(1, 'Select an item!'),
    quantity: z.number().min(1, "Quantity can't be less than 1!"),
    totalPrice: z.number().refine(
        (value) => {
            // Check if the number is finite (not Infinity or NaN)
            if (!Number.isFinite(value)) {
                return false;
            }

            // Convert the number to a string and check the decimal places
            const parts = value.toString().split('.');
            if (parts.length === 1) {
                return true; // No decimal part, considered valid
            }
            // Check if the decimal part has 2 or fewer digits
            return parts[1].length <= 2;
        },
        {
            message: 'Amount must have at most 2 decimal places',
        }
    ),
    supplierName: z.string().optional(),
    invoiceId: z.string().optional(),
});

type AddBatchFormData = z.infer<typeof addBatchSchema>;

interface AddBatchFormProps {
    className?: string;
}

export default function AddBatchForm({ className }: AddBatchFormProps) {
    const [value, setValue] = useState('');

    // Queries
    const { itemsQuery } = useInventoryItemQueries();
    const { createBatchMutation } = useBatchQueries();

    // Convert items to combobox options
    const itemOptions: ComboboxOption[] = itemsQuery.data?.map((item) => ({
        value: item.name,
        label: item.name,
    })) || [];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue: setFormValue,
        reset,
    } = useForm<AddBatchFormData>({
        resolver: zodResolver(addBatchSchema),
        defaultValues: {
            itemName: '',
            quantity: 1,
            totalPrice: 0,
            supplierName: '',
            invoiceId: '',
        },
    });

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
            reset();
            setValue('');
            toast.success('Batch created successfully!');
        } catch (error) {
            // Error creating batch
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
                        <Label htmlFor="itemName" className="mb-1">
                            Item Name
                        </Label>
                        <Combobox
                            options={itemOptions}
                            value={value}
                            onValueChange={(selectedValue) => {
                                setValue(selectedValue);
                                setFormValue('itemName', selectedValue);
                            }}
                            placeholder="Select item name..."
                            searchPlaceholder="Search item name..."
                            emptyText="No item found"
                            width="w-full"
                        />
                        {errors.itemName && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.itemName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min={1}
                            placeholder="Enter quantity"
                            {...register('quantity')}
                            className="mt-1"
                        />
                        {errors.quantity && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.quantity.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="totalPrice">Total Price</Label>
                        <Input
                            id="totalPrice"
                            type="text"
                            placeholder="Enter total price"
                            {...register('totalPrice')}
                            className="mt-1"
                        />
                        {errors.totalPrice && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.totalPrice.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="supplierName">Supplier Name</Label>
                        <Input
                            id="supplierName"
                            type="text"
                            placeholder="Enter supplier's name"
                            {...register('supplierName')}
                            className="mt-1"
                        />
                        {errors.supplierName && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.supplierName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="invoiceId">Invoice ID</Label>
                        <Input
                            id="invoiceId"
                            type="text"
                            placeholder="Enter Invoice ID"
                            {...register('invoiceId')}
                            className="mt-1"
                        />
                        {errors.invoiceId && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.invoiceId.message}
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Batch'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
