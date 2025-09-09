import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
// import { NotificationProvider } from "@/contexts/NotificationContext"; // Disabled for development
import { AppRouter } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/queryClient';

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AuthProvider>
                    {/* <NotificationProvider> */}
                    <AppRouter />
                    <Toaster />
                    {/* </NotificationProvider> */}
                </AuthProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
