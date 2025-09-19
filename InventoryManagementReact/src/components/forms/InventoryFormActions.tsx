import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { AddInventoryFormData } from './InventoryFormValidation';

interface InventoryFormActionsProps {
  isSubmitting: boolean;
  onReset: () => void;
}

export function InventoryFormActions({ isSubmitting, onReset }: InventoryFormActionsProps) {
  const {
    formState: { isValid },
  } = useFormContext<AddInventoryFormData>();

  return (
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
          onClick={onReset}
          disabled={isSubmitting}
        >
          Reset
        </Button>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !isValid
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
  );
}
