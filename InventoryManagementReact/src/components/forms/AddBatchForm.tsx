import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { useInventoryItemQueries } from '@/hooks/queries/useInventoryItems';
import { useBatchQueries } from '@/hooks/queries/useBatch';
import { toast } from 'sonner';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
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
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    // Queries
    const { itemsQuery } = useInventoryItemQueries();
    const { createBatchMutation } = useBatchQueries();

    // Get item names from API
    const itemNames = itemsQuery.data?.map(item => item.name) || [];

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
            console.error('Error creating batch:', error);
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
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                >
                                    {value
                                        ? itemNames.find(
                                              (itemName) => itemName === value
                                          )
                                        : 'Select item name...'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search item name..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No itemName found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {itemNames.map((itemName) => (
                                                <CommandItem
                                                    key={itemName}
                                                    value={itemName}
                                                    onSelect={(
                                                        currentValue
                                                    ) => {
                                                        const selectedValue = currentValue === value ? '' : currentValue;
                                                        setValue(selectedValue);
                                                        setFormValue('itemName', selectedValue);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {itemName}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
                                                            value === itemName
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label htmlFor="quantity">Quantiy</Label>
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
