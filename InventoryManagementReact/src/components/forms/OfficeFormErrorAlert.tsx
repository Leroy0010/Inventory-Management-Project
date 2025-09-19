import React from 'react';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';

interface OfficeFormErrorAlertProps {
    error: unknown;
}

export function OfficeFormErrorAlert({ error }: OfficeFormErrorAlertProps) {
    return (
        <FormErrorAlert
            error={error}
            defaultMessage="Failed to create office. Please try again."
        />
    );
}
