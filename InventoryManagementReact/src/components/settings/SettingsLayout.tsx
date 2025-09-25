import { Tabs } from '@/components/ui/tabs';
import type { SettingsCategory, UserSettings } from '@/types/settings';
import { SettingsNavigation } from './SettingsNavigation';
import { SettingsContent } from './SettingsContent';

interface SettingsLayoutProps {
    activeTab: SettingsCategory;
    onTabChange: (tab: SettingsCategory) => void;
    settings: UserSettings;
    onSettingsUpdate: (
        category: SettingsCategory,
        updates: Partial<any>
    ) => void;
    availableTabs: SettingsCategory[];
}

export function SettingsLayout({
    activeTab,
    onTabChange,
    settings,
    onSettingsUpdate,
    availableTabs,
}: SettingsLayoutProps) {
    return (
        <Tabs
            value={activeTab}
            onValueChange={(value) => onTabChange(value as SettingsCategory)}
            className="space-y-6"
        >
            <div className="space-y-6 xl:space-y-0">
                {/* Mobile Navigation */}
                <SettingsNavigation
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    availableTabs={availableTabs}
                    isMobile={true}
                />

                {/* Desktop Layout */}
                <div className="hidden xl:grid xl:grid-cols-4 gap-6">
                    {/* Settings Navigation */}
                    <SettingsNavigation
                        activeTab={activeTab}
                        onTabChange={onTabChange}
                        availableTabs={availableTabs}
                        isMobile={false}
                    />

                    {/* Settings Content */}
                    <SettingsContent
                        settings={settings}
                        onSettingsUpdate={onSettingsUpdate}
                        isMobile={false}
                    />
                </div>

                {/* Mobile Content */}
                <SettingsContent
                    settings={settings}
                    onSettingsUpdate={onSettingsUpdate}
                    isMobile={true}
                />
            </div>
        </Tabs>
    );
}
