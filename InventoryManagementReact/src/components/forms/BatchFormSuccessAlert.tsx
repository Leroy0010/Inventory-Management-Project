import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface BatchFormSuccessAlertProps {
    show: boolean;
}

export function BatchFormSuccessAlert({ show }: BatchFormSuccessAlertProps) {
    if (!show) return null;

    return (
        <div className="border border-green-200 bg-green-50 text-green-800 rounded-lg px-4 py-3 text-sm flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>Batch created successfully! The form will reset shortly.</div>
        </div>
    );
}
