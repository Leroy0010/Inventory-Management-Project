import React from 'react';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';

interface StaffFormErrorAlertProps {
    error: unknown;
}

export function StaffFormErrorAlert({ error }: StaffFormErrorAlertProps) {
    return (
        <FormErrorAlert
            error={error}
            defaultMessage="Failed to create staff member. Please try again."
        />
    );
}
