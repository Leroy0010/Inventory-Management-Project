import React from 'react';
import { FormErrorAlert } from '@/components/ui/FormErrorAlert';

interface StorekeeperFormErrorAlertProps {
    error: unknown;
}

export function StorekeeperFormErrorAlert({
    error,
}: StorekeeperFormErrorAlertProps) {
    return (
        <FormErrorAlert
            error={error}
            defaultMessage="Failed to create storekeeper. Please try again."
        />
    );
}
