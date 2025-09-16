import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AppRouter } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/queryClient';

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <NotificationProvider>
                    <AppRouter />
                    <Toaster />
                </NotificationProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
