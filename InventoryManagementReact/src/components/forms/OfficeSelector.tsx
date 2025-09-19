import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { AddStaffFormData } from './StaffFormValidation';

interface OfficeSelectorProps {
  officeOptions: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  errors: any;
}

export function OfficeSelector({ officeOptions, value, onValueChange, errors }: OfficeSelectorProps) {
  const { setValue } = useFormContext<AddStaffFormData>();

  const handleValueChange = (selectedValue: string) => {
    onValueChange(selectedValue);
    setValue('office', selectedValue);
  };

  return (
    <div>
      <Label htmlFor="office" className="mb-1">
        Office
      </Label>
      <Combobox
        options={officeOptions}
        value={value}
        onValueChange={handleValueChange}
        placeholder="Select office..."
        searchPlaceholder="Search office..."
        emptyText="No office found"
        width="w-full"
      />
      {errors.office && (
        <p className="text-sm text-red-600 mt-1">
          {errors.office.message}
        </p>
      )}
    </div>
  );
}
