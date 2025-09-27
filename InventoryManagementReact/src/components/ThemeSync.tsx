import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';

export function ThemeSync() {
    const { theme, setTheme } = useTheme();
    const { settings, isInitialized } = useSettings();
    const hasSynced = useRef(false);

    // Sync theme from settings when settings are loaded (only once)
    useEffect(() => {
        if (isInitialized && settings.general.theme && !hasSynced.current) {
            const settingsTheme = settings.general.theme as
                | 'light'
                | 'dark'
                | 'system';
            if (settingsTheme !== theme) {
                console.log('Syncing theme from settings:', settingsTheme);
                setTheme(settingsTheme);
            }
            hasSynced.current = true;
        }
    }, [isInitialized, settings.general.theme, theme, setTheme]);

    return null; // This component doesn't render anything
}
