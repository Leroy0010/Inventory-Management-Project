import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
// import { NotificationProvider } from "@/contexts/NotificationContext"; // Disabled for development
import { AppRouter } from "@/routes";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                {/* <NotificationProvider> */}
                    <AppRouter />
                    <Toaster />
                {/* </NotificationProvider> */}
            </AuthProvider>
        </ThemeProvider>
    );
}
