import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { Loader2, Package2 } from 'lucide-react';
import type { AddBatchFormData } from './BatchFormValidation';

interface BatchFormActionsProps {
    isLoading: boolean;
    isFormValid: boolean;
    onReset: () => void;
}

export function BatchFormActions({
    isLoading,
    isFormValid,
    onReset,
}: BatchFormActionsProps) {
    const {
        formState: { isDirty },
    } = useFormContext<AddBatchFormData>();

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
                            <Package2 className="mr-2 h-4 w-4" />
                            Add Batch
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
