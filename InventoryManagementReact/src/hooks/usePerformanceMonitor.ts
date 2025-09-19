import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
    loadTime: number;
    renderTime: number;
    memoryUsage?: number;
    componentCount: number;
}

interface PerformanceOptions {
    componentName: string;
    trackMemory?: boolean;
    trackRenders?: boolean;
    logToConsole?: boolean;
}

export function usePerformanceMonitor(options: PerformanceOptions) {
    const {
        componentName,
        trackMemory = false,
        trackRenders = true,
        logToConsole = false,
    } = options;
    const renderCount = useRef(0);
    const startTime = useRef(performance.now());
    const lastRenderTime = useRef(performance.now());

    useEffect(() => {
        const loadTime = performance.now() - startTime.current;

        if (trackRenders) {
            renderCount.current += 1;
            const renderTime = performance.now() - lastRenderTime.current;
            lastRenderTime.current = performance.now();

            if (logToConsole) {
                console.log(
                    `[Performance] ${componentName} - Render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
                );
            }
        }

        if (trackMemory && 'memory' in performance) {
            const memory = (performance as any).memory;
            const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB

            if (logToConsole) {
                console.log(
                    `[Performance] ${componentName} - Memory usage: ${memoryUsage.toFixed(2)}MB`
                );
            }
        }

        // Log initial load time
        if (renderCount.current === 1 && logToConsole) {
            console.log(
                `[Performance] ${componentName} - Initial load time: ${loadTime.toFixed(2)}ms`
            );
        }
    });

    // Return performance metrics
    const getMetrics = (): PerformanceMetrics => {
        const loadTime = performance.now() - startTime.current;
        const renderTime = performance.now() - lastRenderTime.current;

        let memoryUsage: number | undefined;
        if (trackMemory && 'memory' in performance) {
            const memory = (performance as any).memory;
            memoryUsage = memory.usedJSHeapSize / 1024 / 1024;
        }

        return {
            loadTime,
            renderTime,
            memoryUsage,
            componentCount: renderCount.current,
        };
    };

    return { getMetrics };
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
    const renderStart = useRef<number>(0);
    const renderCount = useRef(0);

    useEffect(() => {
        renderStart.current = performance.now();
        renderCount.current += 1;
    });

    useEffect(() => {
        const renderTime = performance.now() - renderStart.current;

        if (process.env.NODE_ENV === 'development') {
            console.log(
                `[Render Performance] ${componentName} - Render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
            );
        }
    });

    return { renderCount: renderCount.current };
}

// Hook for measuring async operations
export function useAsyncPerformance(operationName: string) {
    const startTime = useRef<number>(0);

    const startOperation = () => {
        startTime.current = performance.now();
    };

    const endOperation = () => {
        const duration = performance.now() - startTime.current;

        if (process.env.NODE_ENV === 'development') {
            console.log(
                `[Async Performance] ${operationName} took ${duration.toFixed(2)}ms`
            );
        }

        return duration;
    };

    return { startOperation, endOperation };
}

// Hook for measuring bundle size impact
export function useBundleAnalyzer() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && 'performance' in window) {
            // Log resource timing
            const resources = performance.getEntriesByType('resource');
            const jsResources = resources.filter(
                (resource) =>
                    resource.name.includes('.js') &&
                    !resource.name.includes('node_modules')
            );

            const totalSize = jsResources.reduce((total, resource) => {
                const transferSize = (resource as any).transferSize || 0;
                return total + transferSize;
            }, 0);

            console.log(
                `[Bundle Analyzer] Total JS bundle size: ${(totalSize / 1024).toFixed(2)}KB`
            );
            console.log(
                `[Bundle Analyzer] Number of JS chunks: ${jsResources.length}`
            );
        }
    }, []);
}
