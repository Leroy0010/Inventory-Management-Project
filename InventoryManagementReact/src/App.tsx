import { Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeSync } from '@/components/ThemeSync';
import { queryClient } from '@/lib/queryClient';
import { useAuthInit } from './hooks/useAuthInit';

// Lazy load the router for better code splitting
const AppRouter = lazy(() =>
    import('@/routes').then((module) => ({ default: module.AppRouter }))
);
const Toaster = lazy(() =>
    import('@/components/ui/toaster').then((module) => ({
        default: module.Toaster,
    }))
);

// Loading component with better UX
const AppLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading application...</p>
        </div>
    </div>
);

// Error fallback component
const AppErrorFallback = ({
    error,
    resetError,
}: {
    error: Error;
    resetError: () => void;
}) => (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <svg
                    className="w-8 h-8 text-destructive"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
                Application Error
            </h1>
            <p className="text-muted-foreground">
                Something went wrong while loading the application. Please try
                refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && (
                <details className="text-left bg-muted p-4 rounded-lg">
                    <summary className="cursor-pointer font-medium">
                        Error Details
                    </summary>
                    <pre className="mt-2 text-sm text-muted-foreground overflow-auto">
                        {error.message}
                        {error.stack}
                    </pre>
                </details>
            )}
            <button
                onClick={resetError}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
                Try Again
            </button>
        </div>
    </div>
);

function AppContent() {
    // Initialize authentication state
    useAuthInit();

    return (
        <ErrorBoundary
            fallback={
                <AppErrorFallback
                    error={new Error('App initialization failed')}
                    resetError={() => window.location.reload()}
                />
            }
        >
            <ThemeSync />
            <Suspense fallback={<AppLoader />}>
                <AppRouter />
            </Suspense>
            <Suspense fallback={null}>
                <Toaster />
            </Suspense>
        </ErrorBoundary>
    );
}

export default function App() {
    return (
        <ErrorBoundary
            fallback={
                <AppErrorFallback
                    error={new Error('Critical app error')}
                    resetError={() => window.location.reload()}
                />
            }
        >
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <NotificationProvider>
                        <AppContent />
                    </NotificationProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
