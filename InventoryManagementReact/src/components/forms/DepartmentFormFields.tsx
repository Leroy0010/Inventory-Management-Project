import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import type { AddDepartmentFormData } from './DepartmentFormValidation';

interface DepartmentFormFieldsProps {
    watchedValues: any;
    isLoading: boolean;
}

export function DepartmentFormFields({
    watchedValues,
    isLoading,
}: DepartmentFormFieldsProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext<AddDepartmentFormData>();

    return (
        <>
            {/* Department Name Field */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                    Department Name *
                </Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Human Resources, Engineering"
                    {...register('name')}
                    className={`mt-1 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete="off"
                />
                {errors.name && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name.message}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    {watchedValues.name?.length || 0}/50 characters
                </p>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                    Description
                </Label>
                <Input
                    id="description"
                    type="text"
                    placeholder="Brief description of the department (optional)"
                    {...register('description')}
                    className={`mt-1 ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete="off"
                />
                {errors.description && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description.message}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    {watchedValues.description?.length || 0}/500 characters
                </p>
            </div>
        </>
    );
}
