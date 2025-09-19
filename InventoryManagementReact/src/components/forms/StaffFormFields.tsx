import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AddStaffFormData } from './StaffFormValidation';

interface StaffFormFieldsProps {
  errors: any;
}

export function StaffFormFields({ errors }: StaffFormFieldsProps) {
  const { register } = useFormContext<AddStaffFormData>();

  return (
    <>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter staff email"
          {...register('email')}
          className="mt-1"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          placeholder="Enter first name"
          {...register('firstName')}
          className="mt-1"
        />
        {errors.firstName && (
          <p className="text-sm text-red-600 mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          placeholder="Enter last name"
          {...register('lastName')}
          className="mt-1"
        />
        {errors.lastName && (
          <p className="text-sm text-red-600 mt-1">
            {errors.lastName.message}
          </p>
        )}
      </div>
    </>
  );
}
