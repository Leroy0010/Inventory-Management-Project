import { useTheme } from '@/hooks/useTheme';
import { useSettings } from './useSettings';

export function useThemeSettings() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { updateSettings, isInitialized } = useSettings();

    // Update settings when theme changes (local only)
    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);

        // Update local settings (no API call)
        if (isInitialized) {
            updateSettings('general', { theme: newTheme });
        }
    };

    return {
        theme,
        setTheme: handleThemeChange,
        resolvedTheme,
        isLoading: !isInitialized,
    };
}
