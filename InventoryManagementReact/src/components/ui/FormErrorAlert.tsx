import { AlertCircle } from 'lucide-react';
import { formatApiError, formatValidationErrors } from '@/lib/error-utils';

interface FormErrorAlertProps {
    error: unknown;
    defaultMessage?: string;
    className?: string;
}

export function FormErrorAlert({
    error,
    defaultMessage = 'An error occurred. Please try again.',
    className = '',
}: FormErrorAlertProps) {
    if (!error) return null;

    const apiError = formatApiError(error);
    const validationErrors = formatValidationErrors(apiError.details || null);

    return (
        <div
            className={`border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm flex items-start gap-3 ${className}`}
        >
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="font-medium mb-2 break-words">
                    {apiError.message || defaultMessage}
                </div>
                {validationErrors.length > 0 && (
                    <div className="mt-2">
                        <div className="font-medium text-sm mb-1">
                            Validation errors:
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs break-words">
                            {validationErrors.map((error, index) => (
                                <li key={index} className="break-words">
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
