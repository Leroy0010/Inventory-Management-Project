import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Eye,
    Monitor,
    Lock,
    Zap,
    Save,
    RotateCcw,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { usePermissions } from '@/hooks/usePermissions';
import type { UserSettings, SettingsCategory } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';
import { GeneralSettingsTab } from '@/components/settings/GeneralSettingsTab';
import { NotificationSettingsTab } from '@/components/settings/NotificationSettingsTab';
import { PrivacySettingsTab } from '@/components/settings/PrivacySettingsTab';
import { ApplicationSettingsTab } from '@/components/settings/ApplicationSettingsTab';
import { SecuritySettingsTab } from '@/components/settings/SecuritySettingsTab';
import { AdvancedSettingsTab } from '@/components/settings/AdvancedSettingsTab';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsTabs } from '@/components/settings/SettingsTabs';
import { useSettings } from '@/hooks/useSettings';

export default function Settings() {
    const { user } = useAuthStore();
    const { hasPermission } = usePermissions();
    const [activeTab, setActiveTab] = useState<SettingsCategory>('general');
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<
        'idle' | 'saving' | 'saved' | 'error'
    >('idle');

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        try {
            const savedSettings = localStorage.getItem('user-settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        setSaveStatus('saving');

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const updatedSettings = {
                ...settings,
                lastUpdated: new Date().toISOString(),
            };

            localStorage.setItem(
                'user-settings',
                JSON.stringify(updatedSettings)
            );
            setSettings(updatedSettings);
            setHasUnsavedChanges(false);
            setSaveStatus('saved');

            // Reset status after 2 seconds
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Failed to save settings:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        setHasUnsavedChanges(true);
    };

    const handleSettingsUpdate = (
        category: SettingsCategory,
        newSettings: Partial<any>
    ) => {
        setSettings((prev) => ({
            ...prev,
            [category]: { ...prev[category], ...newSettings },
        }));
        setHasUnsavedChanges(true);
    };

    const getTabIcon = (tab: SettingsCategory) => {
        switch (tab) {
            case 'general':
                return SettingsIcon;
            case 'notifications':
                return Bell;
            case 'privacy':
                return Eye;
            case 'application':
                return Monitor;
            case 'security':
                return Shield;
            case 'advanced':
                return Zap;
            default:
                return SettingsIcon;
        }
    };

    const getTabPermissions = (tab: SettingsCategory): string[] => {
        switch (tab) {
            case 'general':
                return ['VIEW_SETTINGS'];
            case 'notifications':
                return ['VIEW_NOTIFICATIONS'];
            case 'privacy':
                return ['VIEW_SETTINGS'];
            case 'application':
                return ['VIEW_SETTINGS'];
            case 'security':
                return ['VIEW_SETTINGS'];
            case 'advanced':
                return ['EDIT_SETTINGS'];
            default:
                return ['VIEW_SETTINGS'];
        }
    };

    const canAccessTab = (tab: SettingsCategory): boolean => {
        const permissions = getTabPermissions(tab);
        return permissions.some((permission) =>
            hasPermission(permission as any)
        );
    };

    const allTabs: SettingsCategory[] = [
        'general',
        'notifications',
        'privacy',
        'application',
        'security',
        'advanced',
    ];

    const availableTabs = allTabs.filter(canAccessTab);

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <SettingsHeader
                title="Settings"
                description="Manage your application preferences, security settings, and personalization options."
                lastUpdated={settings.lastUpdated}
            />

            <div className="space-y-6">
                {/* Save Status and Actions */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {saveStatus === 'saved' && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                {saveStatus === 'error' && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {saveStatus === 'saving' &&
                                        'Saving changes...'}
                                    {saveStatus === 'saved' &&
                                        'Settings saved successfully'}
                                    {saveStatus === 'error' &&
                                        'Failed to save settings'}
                                    {saveStatus === 'idle' &&
                                        hasUnsavedChanges &&
                                        'You have unsaved changes'}
                                    {saveStatus === 'idle' &&
                                        !hasUnsavedChanges &&
                                        'All changes saved'}
                                </span>
                                {hasUnsavedChanges && (
                                    <Badge
                                        variant="outline"
                                        className="text-orange-600 border-orange-200"
                                    >
                                        Unsaved
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={resetSettings}
                                    disabled={isSaving || !hasUnsavedChanges}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                                <Button
                                    onClick={saveSettings}
                                    disabled={isSaving || !hasUnsavedChanges}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as SettingsCategory)
                    }
                    className="space-y-6"
                >
                    <SettingsTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        availableTabs={availableTabs}
                    />

                    <TabsContent value="general" className="space-y-6">
                        <GeneralSettingsTab
                            settings={settings.general}
                            onUpdate={(newSettings) =>
                                handleSettingsUpdate('general', newSettings)
                            }
                            isLoading={isSaving}
                        />
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <NotificationSettingsTab
                            settings={settings.notifications}
                            onUpdate={(newSettings) =>
                                handleSettingsUpdate(
                                    'notifications',
                                    newSettings
                                )
                            }
                            isLoading={isSaving}
                        />
                    </TabsContent>

                    <TabsContent value="privacy" className="space-y-6">
                        <PrivacySettingsTab
                            settings={settings.privacy}
                            onUpdate={(newSettings) =>
                                handleSettingsUpdate('privacy', newSettings)
                            }
                            isLoading={isSaving}
                        />
                    </TabsContent>

                    <TabsContent value="application" className="space-y-6">
                        <ApplicationSettingsTab
                            settings={settings.application}
                            onUpdate={(newSettings) =>
                                handleSettingsUpdate('application', newSettings)
                            }
                            isLoading={isSaving}
                        />
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <SecuritySettingsTab
                            settings={settings.security}
                            onUpdate={(newSettings) =>
                                handleSettingsUpdate('security', newSettings)
                            }
                            isLoading={isSaving}
                        />
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6">
                        <AdvancedSettingsTab
                            settings={settings.advanced}
                            onUpdate={(newSettings) =>
                                handleSettingsUpdate('advanced', newSettings)
                            }
                            isLoading={isSaving}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
