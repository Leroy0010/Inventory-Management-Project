import { useState, useEffect } from 'react';
import { formatShortDate } from '@/utils/dateUtils';
import { useAuthStore } from '@/stores/authStore';
import { usePermissions } from '@/hooks/usePermissions';
import type { UserSettings, SettingsCategory } from '@/types/settings';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { SettingsActions } from '@/components/settings/SettingsActions';
import { SettingsLoading } from '@/components/settings/SettingsLoading';
import { useSettings } from '../hooks/useSettings';

export default function Settings() {
    const { user } = useAuthStore();
    const { hasPermission } = usePermissions();
    const [activeTab, setActiveTab] = useState<SettingsCategory>('general');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saveStatus, setSaveStatus] = useState<
        'idle' | 'saving' | 'saved' | 'error'
    >('idle');

    const {
        settings,
        isLoading,
        isSaving,
        error,
        loadSettings,
        saveSettings,
        updateSettings,
        resetSettings,
        exportSettings,
        importSettings,
    } = useSettings();

    // Update save status based on hook state
    useEffect(() => {
        if (isSaving) {
            setSaveStatus('saving');
        } else if (error) {
            setSaveStatus('error');
        } else if (saveStatus === 'saving') {
            setSaveStatus('saved');
            setHasUnsavedChanges(false);
            // Clear saved status after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    }, [isSaving, error, saveStatus]);

    // Handle settings update with API integration
    const handleSettingsUpdate = async (
        category: SettingsCategory,
        newSettings: Partial<any>
    ) => {
        try {
            await updateSettings(category, newSettings);
            setHasUnsavedChanges(true);
            setSaveStatus('idle');
        } catch (err) {
            console.error('Failed to update settings:', err);
            setSaveStatus('error');
        }
    };

    // Handle save all settings
    const handleSaveAll = async () => {
        try {
            await saveSettings(settings);
        } catch (err) {
            console.error('Failed to save settings:', err);
            setSaveStatus('error');
        }
    };

    // Handle reset settings
    const handleReset = async () => {
        try {
            await resetSettings();
            setHasUnsavedChanges(false);
            setSaveStatus('idle');
        } catch (err) {
            console.error('Failed to reset settings:', err);
            setSaveStatus('error');
        }
    };

    // Handle export settings
    const handleExport = async () => {
        try {
            const exportedSettings = await exportSettings();
            const dataStr = JSON.stringify(exportedSettings, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `user-settings-${formatShortDate(new Date().toISOString())}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to export settings:', err);
            setSaveStatus('error');
        }
    };

    // Handle import settings
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importedSettings = JSON.parse(text);
            await importSettings(importedSettings);
            setHasUnsavedChanges(false);
            setSaveStatus('saved');
        } catch (err) {
            console.error('Failed to import settings:', err);
            setSaveStatus('error');
        }
    };

    // Get tab permissions
    const getTabPermissions = (category: SettingsCategory) => {
        const permissions = {
            general: ['VIEW_SETTINGS'],
            notifications: ['VIEW_SETTINGS'],
            privacy: ['VIEW_SETTINGS'],
            application: ['VIEW_SETTINGS'],
            security: ['VIEW_SETTINGS', 'MANAGE_SECURITY'],
            advanced: ['VIEW_SETTINGS', 'MANAGE_ADVANCED'],
        };
        return permissions[category] || [];
    };

    // Check if user can access tab
    const canAccessTab = (category: SettingsCategory) => {
        const permissions = getTabPermissions(category);
        return permissions.every((permission) =>
            hasPermission(permission as any)
        );
    };

    // Available tabs based on permissions
    const allTabs: SettingsCategory[] = [
        'general',
        'notifications',
        'privacy',
        'application',
        'security',
        'advanced',
    ];
    const availableTabs = allTabs.filter(canAccessTab);

    if (isLoading) {
        return <SettingsLoading />;
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <SettingsHeader
                title="Settings"
                description="Manage your application preferences and configuration"
                lastUpdated={settings.lastUpdated}
            />

            <SettingsLayout
                activeTab={activeTab}
                onTabChange={setActiveTab}
                settings={settings}
                onSettingsUpdate={handleSettingsUpdate}
                availableTabs={availableTabs}
            />

            <SettingsActions
                saveStatus={saveStatus}
                hasUnsavedChanges={hasUnsavedChanges}
                error={error || undefined}
                isSaving={isSaving}
                onSave={handleSaveAll}
                onReset={handleReset}
                onExport={handleExport}
                onImport={handleImport}
                onRefresh={loadSettings}
            />
        </div>
    );
}
