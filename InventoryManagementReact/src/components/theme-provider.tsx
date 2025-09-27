import { useEffect, useState } from 'react';
import { ThemeProviderContext } from './theme-context';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
    onThemeChange?: (theme: Theme) => void;
};

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
    onThemeChange,
    ...props
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

    // Detect system theme preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light');
        };

        // Set initial system theme
        setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

        // Listen for system theme changes
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        const resolvedTheme = theme === 'system' ? systemTheme : theme;
        root.classList.add(resolvedTheme);

        // Set data attribute for CSS variables
        root.setAttribute('data-theme', resolvedTheme);
    }, [theme, systemTheme]);

    const setTheme = (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
        onThemeChange?.(newTheme);
    };

    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    const value = {
        theme,
        setTheme,
        resolvedTheme,
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
