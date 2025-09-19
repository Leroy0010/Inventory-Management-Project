import React, { memo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedLoader } from './optimized-loader';

interface OptimizedImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallbackSrc?: string;
    lazy?: boolean;
    placeholder?: React.ReactNode;
    errorPlaceholder?: React.ReactNode;
    onLoad?: () => void;
    onError?: () => void;
}

const OptimizedImage = memo<OptimizedImageProps>(
    ({
        src,
        alt,
        fallbackSrc,
        lazy = true,
        placeholder,
        errorPlaceholder,
        onLoad,
        onError,
        className,
        ...props
    }) => {
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);
        const [currentSrc, setCurrentSrc] = useState(src);

        const handleLoad = useCallback(() => {
            setIsLoading(false);
            setHasError(false);
            onLoad?.();
        }, [onLoad]);

        const handleError = useCallback(() => {
            setIsLoading(false);
            setHasError(true);

            if (fallbackSrc && currentSrc !== fallbackSrc) {
                setCurrentSrc(fallbackSrc);
                setIsLoading(true);
                setHasError(false);
            } else {
                onError?.();
            }
        }, [fallbackSrc, currentSrc, onError]);

        const defaultPlaceholder = (
            <div
                className={cn(
                    'flex items-center justify-center bg-muted',
                    className
                )}
            >
                <OptimizedLoader size="md" variant="pulse" />
            </div>
        );

        const defaultErrorPlaceholder = (
            <div
                className={cn(
                    'flex items-center justify-center bg-muted text-muted-foreground',
                    className
                )}
            >
                <div className="text-center">
                    <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-sm">Failed to load image</p>
                </div>
            </div>
        );

        if (hasError) {
            return <>{errorPlaceholder || defaultErrorPlaceholder}</>;
        }

        return (
            <div className={cn('relative', className)}>
                {isLoading && (placeholder || defaultPlaceholder)}
                <img
                    src={currentSrc}
                    alt={alt}
                    loading={lazy ? 'lazy' : 'eager'}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'transition-opacity duration-200',
                        isLoading
                            ? 'opacity-0 absolute inset-0'
                            : 'opacity-100',
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage };
