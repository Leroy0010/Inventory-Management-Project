import { useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';
import { getCurrentDateISO } from '../utils/dateUtils';
import UserSettingsApi, {
    type UserSettingsResponse,
} from '../api/userSettings';

export function useSettings() {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load settings from API
    const loadSettings = useCallback(async () => {
        if (isLoading || isInitialized) {
            console.log('Settings already loading or initialized, skipping...');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            console.log('Loading settings from API...');

            // Check if user has settings first
            const hasSettings = await UserSettingsApi.hasUserSettings();
            console.log('User has settings:', hasSettings);

            if (hasSettings) {
                const apiSettings = await UserSettingsApi.getUserSettings();
                console.log('API settings loaded:', apiSettings);
                const convertedSettings =
                    convertApiResponseToSettings(apiSettings);
                console.log('Converted settings:', convertedSettings);
                setSettings(convertedSettings);
            } else {
                // User doesn't have settings, use defaults
                console.log('No settings found, using defaults');
                setSettings(DEFAULT_SETTINGS);
            }
            setIsInitialized(true);
        } catch (err) {
            console.error('Error loading settings from API:', err);
            setError('Failed to load settings from server');
            // Fallback to localStorage if API fails
            try {
                const savedSettings = localStorage.getItem('user-settings');
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    setSettings({ ...DEFAULT_SETTINGS, ...parsed });
                }
            } catch (localErr) {
                console.error(
                    'Error loading settings from localStorage:',
                    localErr
                );
            }
            setIsInitialized(true);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, isInitialized]);

    // Save all settings to API
    const saveSettings = useCallback(async (newSettings: UserSettings) => {
        setIsSaving(true);
        setError(null);

        try {
            const updatedSettings = await UserSettingsApi.saveUserSettings(
                convertSettingsToApiRequest(newSettings)
            );
            const convertedSettings =
                convertApiResponseToSettings(updatedSettings);

            // Also save to localStorage as backup
            try {
                localStorage.setItem(
                    'user-settings',
                    JSON.stringify(convertedSettings)
                );
            } catch (localErr) {
                console.warn('Failed to save to localStorage:', localErr);
            }

            setSettings(convertedSettings);
            return convertedSettings;
        } catch (err) {
            console.error('Failed to save settings:', err);
            setError('Failed to save settings');
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    // Update specific settings category (local only - no API call)
    const updateSettings = useCallback(
        (category: keyof UserSettings, newSettings: Partial<any>) => {
            console.log(`Updating ${category} settings locally:`, newSettings);

            // Update local state immediately for better UX
            const updatedLocalSettings = {
                ...settings,
                [category]: {
                    ...(settings[category] as any),
                    ...newSettings,
                },
            };
            console.log('Updated local settings:', updatedLocalSettings);
            setSettings(updatedLocalSettings);

            // Save to localStorage as backup
            try {
                localStorage.setItem(
                    'user-settings',
                    JSON.stringify(updatedLocalSettings)
                );
            } catch (localErr) {
                console.warn('Failed to save to localStorage:', localErr);
            }
        },
        [settings]
    );

    // Reset settings to defaults
    const resetSettings = useCallback(async () => {
        try {
            setIsSaving(true);
            setError(null);

            const defaultSettings = await UserSettingsApi.resetToDefaults();
            const convertedSettings =
                convertApiResponseToSettings(defaultSettings);
            setSettings(convertedSettings);

            // Also save to localStorage as backup
            try {
                localStorage.setItem(
                    'user-settings',
                    JSON.stringify(convertedSettings)
                );
            } catch (localErr) {
                console.warn('Failed to save to localStorage:', localErr);
            }
        } catch (err) {
            console.error('Error resetting settings:', err);
            setError('Failed to reset settings');
            // Fallback to local reset
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setIsSaving(false);
        }
    }, []);

    // Export settings
    const exportSettings = useCallback(async () => {
        try {
            const exportedSettings = await UserSettingsApi.exportUserSettings();
            return convertApiResponseToSettings(exportedSettings);
        } catch (err) {
            console.error('Error exporting settings:', err);
            setError('Failed to export settings');
            throw err;
        }
    }, []);

    // Import settings
    const importSettings = useCallback(
        async (importedSettings: UserSettings) => {
            try {
                setIsSaving(true);
                setError(null);

                const updatedSettings =
                    await UserSettingsApi.importUserSettings({
                        settings: convertSettingsToApiRequest(
                            importedSettings
                        ) as UserSettingsResponse,
                    });
                const convertedSettings =
                    convertApiResponseToSettings(updatedSettings);
                setSettings(convertedSettings);

                // Also save to localStorage as backup
                try {
                    localStorage.setItem(
                        'user-settings',
                        JSON.stringify(convertedSettings)
                    );
                } catch (localErr) {
                    console.warn('Failed to save to localStorage:', localErr);
                }
            } catch (err) {
                console.error('Error importing settings:', err);
                setError('Failed to import settings');
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    // Manual refresh function
    const refreshSettings = useCallback(async () => {
        setIsInitialized(false);
        await loadSettings();
    }, [loadSettings]);

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    return {
        settings,
        isLoading,
        isSaving,
        error,
        isInitialized,
        loadSettings: refreshSettings,
        saveSettings,
        updateSettings,
        resetSettings,
        exportSettings,
        importSettings,
    };
}

// Helper functions to convert between API response and frontend settings format
const convertApiResponseToSettings = (
    apiResponse: UserSettingsResponse
): UserSettings => {
    return {
        general: {
            theme: apiResponse.theme as any,
            language: apiResponse.language as any,
            timezone: apiResponse.timezone || 'UTC',
            dateFormat: 'MM/DD/YYYY' as any,
            timeFormat: '12h' as any,
            autoSave: apiResponse.autoSave,
            confirmActions: true,
        },
        notifications: {
            emailNotifications: apiResponse.emailNotifications,
            pushNotifications: apiResponse.pushNotifications,
            inAppNotifications: apiResponse.inAppNotifications,
            requestUpdates: 'immediate' as any,
            systemAlerts: 'immediate' as any,
            reportReady: 'immediate' as any,
            weeklyDigest: true,
            quietHours: {
                enabled: false,
                start: '22:00',
                end: '08:00',
            },
            channels: {
                email: apiResponse.emailNotifications,
                push: apiResponse.pushNotifications,
                in_app: apiResponse.inAppNotifications,
            },
        },
        privacy: {
            profileVisibility: apiResponse.profileVisibility as any,
            activityTracking: apiResponse.activityTracking,
            marketingEmails: apiResponse.marketingEmails,
            dataSharing: 'analytics' as any,
            analyticsOptIn: true,
            showOnlineStatus: true,
            allowDirectMessages: true,
        },
        application: {
            dashboardLayout: apiResponse.dashboardLayout as any,
            defaultPageSize: apiResponse.defaultPageSize as any,
            autoRefresh: apiResponse.autoRefresh,
            refreshInterval: apiResponse.refreshInterval,
            reportFormat: apiResponse.reportFormat as any,
            showTutorials: true,
            compactMode: false,
            sidebarCollapsed: false,
            exportLocation: 'downloads',
            autoExport: false,
        },
        security: {
            twoFactorEnabled: apiResponse.twoFactorEnabled,
            sessionTimeout: apiResponse.sessionTimeout as any,
            loginNotifications: apiResponse.loginNotifications,
            twoFactorMethod: 'none' as any,
            passwordExpiry: 90,
            requirePasswordChange: false,
            trustedDevices: true,
            apiAccess: false,
        },
        advanced: {
            apiKey: apiResponse.apiKey || '',
            webhookUrl: apiResponse.webhookUrl || '',
            integrations: {
                slack: apiResponse.slackIntegration,
                teams: apiResponse.teamsIntegration,
                email: apiResponse.emailIntegration,
            },
            debugMode: apiResponse.debugMode,
            logLevel: apiResponse.logLevel as any,
            cacheEnabled: apiResponse.cacheEnabled,
            cacheTimeout: apiResponse.cacheTimeout,
            experimentalFeatures: apiResponse.experimentalFeatures,
        },
        lastUpdated: getCurrentDateISO(),
        version: '1.0.0',
    };
};

const convertSettingsToApiRequest = (
    settings: UserSettings
): Partial<UserSettingsResponse> => {
    return {
        theme: settings.general.theme,
        language: settings.general.language,
        timezone: settings.general.timezone,
        autoSave: settings.general.autoSave,
        emailNotifications: settings.notifications.emailNotifications,
        pushNotifications: settings.notifications.pushNotifications,
        inAppNotifications: settings.notifications.inAppNotifications,
        profileVisibility: settings.privacy.profileVisibility,
        activityTracking: settings.privacy.activityTracking,
        marketingEmails: settings.privacy.marketingEmails,
        dashboardLayout: settings.application.dashboardLayout,
        defaultPageSize: settings.application.defaultPageSize,
        autoRefresh: settings.application.autoRefresh,
        refreshInterval: settings.application.refreshInterval,
        reportFormat: settings.application.reportFormat,
        twoFactorEnabled: settings.security.twoFactorEnabled,
        sessionTimeout: settings.security.sessionTimeout,
        loginNotifications: settings.security.loginNotifications,
        apiKey: settings.advanced.apiKey,
        webhookUrl: settings.advanced.webhookUrl,
        slackIntegration: settings.advanced.integrations.slack,
        teamsIntegration: settings.advanced.integrations.teams,
        emailIntegration: settings.advanced.integrations.email,
        debugMode: settings.advanced.debugMode,
        logLevel: settings.advanced.logLevel,
        cacheEnabled: settings.advanced.cacheEnabled,
        cacheTimeout: settings.advanced.cacheTimeout,
        experimentalFeatures: settings.advanced.experimentalFeatures,
        smsNotifications: false,
        desktopNotifications: false,
    };
};
