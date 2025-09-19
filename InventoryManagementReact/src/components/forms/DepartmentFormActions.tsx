import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Building2 } from 'lucide-react';
import type { AddDepartmentFormData } from './DepartmentFormValidation';

interface DepartmentFormActionsProps {
    isLoading: boolean;
    onReset: () => void;
}

export function DepartmentFormActions({
    isLoading,
    onReset,
}: DepartmentFormActionsProps) {
    const {
        formState: { isValid, isDirty },
    } = useFormContext<AddDepartmentFormData>();

    const isFormValid = isValid && isDirty;

    return (
        <>
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className="flex-1"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Building2 className="mr-2 h-4 w-4" />
                            Add Department
                        </>
                    )}
                </Button>
            </div>

            {/* Form Status Indicator */}
            {isDirty && !isFormValid && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    Please fill in all required fields correctly to continue.
                </div>
            )}
        </>
    );
}
