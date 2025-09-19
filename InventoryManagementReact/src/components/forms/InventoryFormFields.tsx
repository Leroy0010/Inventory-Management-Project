import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import type { AddInventoryFormData } from './InventoryFormValidation';

interface InventoryFormFieldsProps {
  watchedValues: any;
}

export function InventoryFormFields({ watchedValues }: InventoryFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddInventoryFormData>();

  return (
    <>
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
    </>
  );
}
