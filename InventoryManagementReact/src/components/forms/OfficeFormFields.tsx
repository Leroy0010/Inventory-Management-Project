import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import type { AddOfficeFormData } from './OfficeFormValidation';

export function OfficeFormFields() {
    const {
        register,
        formState: { errors },
    } = useFormContext<AddOfficeFormData>();

    return (
        <>
            <div>
                <Label htmlFor="name">Office Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter office name"
                    {...register('name')}
                    className="mt-1"
                />
                {errors.name && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    type="text"
                    placeholder="Enter office location (optional)"
                    {...register('location')}
                    className="mt-1"
                />
                {errors.location && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.location.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    type="text"
                    placeholder="Enter office description (optional)"
                    {...register('description')}
                    className="mt-1"
                />
                {errors.description && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description.message}
                    </p>
                )}
            </div>
        </>
    );
}
