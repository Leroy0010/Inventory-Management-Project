import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
            className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-primary transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

// Loading spinner component
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({
    size = 'md',
    className,
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                sizeClasses[size],
                className
            )}
        />
    );
}

// Loading overlay component
interface LoadingOverlayProps {
    isLoading: boolean;
    children: React.ReactNode;
    message?: string;
    className?: string;
}

export function LoadingOverlay({
    isLoading,
    children,
    message = 'Loading...',
    className,
}: LoadingOverlayProps) {
    return (
        <div className={cn('relative', className)}>
            {children}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center space-y-2">
                        <LoadingSpinner size="lg" />
                        <p className="text-sm text-muted-foreground">
                            {message}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Loading button component
interface LoadingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export function LoadingButton({
    isLoading = false,
    loadingText = 'Loading...',
    children,
    disabled,
    className,
    ...props
}: LoadingButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
}

export { Progress };
