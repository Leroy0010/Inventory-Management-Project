import React from 'react';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';

interface DepartmentFormErrorAlertProps {
    error: unknown;
}

export function DepartmentFormErrorAlert({
    error,
}: DepartmentFormErrorAlertProps) {
    return (
        <FormErrorAlert
            error={error}
            defaultMessage="Failed to create department. Please try again."
        />
    );
}
