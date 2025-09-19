import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedLoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
    className?: string;
    text?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

const OptimizedLoader = memo<OptimizedLoaderProps>(
    ({
        size = 'md',
        variant = 'spinner',
        className,
        text,
        fullScreen = false,
    }) => {
        const containerClasses = cn(
            'flex items-center justify-center',
            fullScreen && 'min-h-screen',
            className
        );

        const renderLoader = () => {
            switch (variant) {
                case 'spinner':
                    return (
                        <div
                            className={cn(
                                'border-4 border-primary/20 border-t-primary rounded-full animate-spin',
                                sizeClasses[size]
                            )}
                        />
                    );

                case 'dots':
                    return (
                        <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'bg-primary rounded-full animate-pulse',
                                        size === 'sm'
                                            ? 'w-2 h-2'
                                            : size === 'md'
                                              ? 'w-3 h-3'
                                              : size === 'lg'
                                                ? 'w-4 h-4'
                                                : 'w-5 h-5'
                                    )}
                                    style={{
                                        animationDelay: `${i * 0.2}s`,
                                        animationDuration: '1s',
                                    }}
                                />
                            ))}
                        </div>
                    );

                case 'pulse':
                    return (
                        <div
                            className={cn(
                                'bg-primary rounded-full animate-pulse',
                                sizeClasses[size]
                            )}
                        />
                    );

                case 'skeleton':
                    return (
                        <div className="space-y-2 w-full max-w-sm">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                        </div>
                    );

                default:
                    return null;
            }
        };

        return (
            <div className={containerClasses}>
                <div className="flex flex-col items-center space-y-2">
                    {renderLoader()}
                    {text && (
                        <p className="text-sm text-muted-foreground animate-pulse">
                            {text}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

OptimizedLoader.displayName = 'OptimizedLoader';

export { OptimizedLoader };
