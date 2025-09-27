import { useTheme } from '@/hooks/useTheme';
import { useSettings } from './useSettings';

export function useThemeTopbar() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { updateSettings, saveSettings, settings, isInitialized } =
        useSettings();

    // Update theme and save to database (for Topbar)
    const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);

        // Update local settings (this also saves to localStorage)
        if (isInitialized) {
            updateSettings('general', { theme: newTheme });

            // Save to database in the background (don't block UI)
            try {
                // Create updated settings object with the new theme
                const updatedSettings = {
                    ...settings,
                    general: {
                        ...settings.general,
                        theme: newTheme,
                    },
                };

                // Save to database
                await saveSettings(updatedSettings);
                console.log('Theme saved to database from Topbar');
            } catch (error) {
                console.warn(
                    'Failed to save theme to database (will retry later):',
                    error
                );
                // Theme is still saved locally, so user experience is not affected
            }
        }
    };

    return {
        theme,
        setTheme: handleThemeChange,
        resolvedTheme,
        isLoading: !isInitialized,
    };
}
