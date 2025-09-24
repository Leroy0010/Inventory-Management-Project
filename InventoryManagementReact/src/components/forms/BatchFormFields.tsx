import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import type { AddBatchFormData } from './BatchFormValidation';

interface BatchFormFieldsProps {
    itemOptions: ComboboxOption[];
    value: string;
    setValue: (value: string) => void;
    setFormValue: (name: keyof AddBatchFormData, value: any) => void;
    watchedValues: AddBatchFormData;
    isLoading: boolean;
}

export function BatchFormFields({
    itemOptions,
    value,
    setValue,
    setFormValue,
    watchedValues,
    isLoading,
}: BatchFormFieldsProps) {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<AddBatchFormData>();
    const itemName = watch('itemName');

    return (
        <div className="space-y-6">
            {/* Item Name Field */}
            <div className="space-y-2">
                <Label htmlFor="itemName" className="text-sm font-medium">
                    Item Name *
                </Label>
                <Combobox
                    options={itemOptions}
                    value={itemName}
                    onValueChange={(selectedValue) => {
                        setValue(selectedValue);
                        setFormValue('itemName', selectedValue);
                    }}
                    placeholder="Select item name..."
                    searchPlaceholder="Search item name..."
                    emptyText="No item found"
                    width="w-full"
                    disabled={isLoading}
                />
                {errors.itemName && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.itemName.message}
                    </p>
                )}
            </div>

            {/* Quantity Field */}
            <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity *
                </Label>
                <Input
                    id="quantity"
                    type="number"
                    min={1}
                    placeholder="Enter quantity"
                    {...register('quantity', { valueAsNumber: true })}
                    className={`mt-1 ${errors.quantity ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete="off"
                />
                {errors.quantity && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.quantity.message}
                    </p>
                )}
            </div>

            {/* Total Price Field */}
            <div className="space-y-2">
                <Label htmlFor="totalPrice" className="text-sm font-medium">
                    Total Price *
                </Label>
                <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    placeholder="Enter total price"
                    {...register('totalPrice', { valueAsNumber: true })}
                    className={`mt-1 ${errors.totalPrice ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete="off"
                />
                {errors.totalPrice && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.totalPrice.message}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    Enter amount with up to 2 decimal places
                </p>
            </div>

            {/* Supplier Name Field */}
            <div className="space-y-2">
                <Label htmlFor="supplierName" className="text-sm font-medium">
                    Supplier Name
                </Label>
                <Input
                    id="supplierName"
                    type="text"
                    placeholder="Enter supplier's name (optional)"
                    {...register('supplierName')}
                    className={`mt-1 ${errors.supplierName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete="off"
                />
                {errors.supplierName && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.supplierName.message}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    {watchedValues.supplierName?.length || 0}/100 characters
                </p>
            </div>

            {/* Invoice ID Field */}
            <div className="space-y-2">
                <Label htmlFor="invoiceId" className="text-sm font-medium">
                    Invoice ID
                </Label>
                <Input
                    id="invoiceId"
                    type="text"
                    placeholder="Enter Invoice ID (optional)"
                    {...register('invoiceId')}
                    className={`mt-1 ${errors.invoiceId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete="off"
                />
                {errors.invoiceId && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.invoiceId.message}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    {watchedValues.invoiceId?.length || 0}/20 characters
                </p>
            </div>
        </div>
    );
}
