import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
    required?: boolean;
}

export function FormField({
    label,
    htmlFor,
    error,
    children,
    className,
    required = false,
}: FormFieldProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <Label
                htmlFor={htmlFor}
                className={
                    required
                        ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
                        : ''
                }
            >
                {label}
            </Label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
