import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import type { AddStorekeeperFormData } from './StorekeeperFormValidation';

interface StorekeeperFormActionsProps {
    isSubmitting: boolean;
}

export function StorekeeperFormActions({
    isSubmitting,
}: StorekeeperFormActionsProps) {
    return (
        <div className="pt-4">
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer"
            >
                {isSubmitting ? 'Adding...' : 'Add Storekeeper'}
            </Button>
        </div>
    );
}
