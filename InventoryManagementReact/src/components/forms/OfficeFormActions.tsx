import React from 'react';
import { Button } from '@/components/ui/button';

interface OfficeFormActionsProps {
    isSubmitting: boolean;
}

export function OfficeFormActions({ isSubmitting }: OfficeFormActionsProps) {
    return (
        <div className="pt-4">
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer"
            >
                {isSubmitting ? 'Adding...' : 'Add Office'}
            </Button>
        </div>
    );
}
