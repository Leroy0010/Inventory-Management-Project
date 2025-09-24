import { useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';

export function useSettings() {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load settings from localStorage
    const loadSettings = useCallback(() => {
        try {
            const savedSettings = localStorage.getItem('user-settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
            setError('Failed to load settings');
        }
    }, []);

    // Save settings to localStorage
    const saveSettings = useCallback(async (newSettings: UserSettings) => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const updatedSettings = {
                ...newSettings,
                lastUpdated: new Date().toISOString(),
            };

            localStorage.setItem(
                'user-settings',
                JSON.stringify(updatedSettings)
            );
            setSettings(updatedSettings);

            return updatedSettings;
        } catch (err) {
            console.error('Failed to save settings:', err);
            setError('Failed to save settings');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update specific settings category
    const updateSettings = useCallback(
        (category: keyof UserSettings, newSettings: Partial<any>) => {
            setSettings((prev) => ({
                ...prev,
                [category]: { ...(prev[category] as any), ...newSettings },
            }));
        },
        []
    );

    // Reset settings to defaults
    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
    }, []);

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    return {
        settings,
        isLoading,
        error,
        loadSettings,
        saveSettings,
        updateSettings,
        resetSettings,
    };
}
