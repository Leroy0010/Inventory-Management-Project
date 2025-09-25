import { TabsContent } from '@/components/ui/tabs';
import type { SettingsCategory, UserSettings } from '@/types/settings';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { NotificationSettingsTab } from './NotificationSettingsTab';
import { PrivacySettingsTab } from './PrivacySettingsTab';
import { ApplicationSettingsTab } from './ApplicationSettingsTab';
import { SecuritySettingsTab } from './SecuritySettingsTab';
import { AdvancedSettingsTab } from './AdvancedSettingsTab';

interface SettingsContentProps {
    settings: UserSettings;
    onSettingsUpdate: (
        category: SettingsCategory,
        updates: Partial<any>
    ) => void;
    isMobile?: boolean;
}

export function SettingsContent({
    settings,
    onSettingsUpdate,
    isMobile = false,
}: SettingsContentProps) {
    const tabContent = (category: SettingsCategory) => (
        <TabsContent value={category} className="space-y-6">
            {category === 'general' && (
                <GeneralSettingsTab
                    settings={settings.general}
                    onUpdate={(updates) => onSettingsUpdate('general', updates)}
                />
            )}
            {category === 'notifications' && (
                <NotificationSettingsTab
                    settings={settings.notifications}
                    onUpdate={(updates) =>
                        onSettingsUpdate('notifications', updates)
                    }
                />
            )}
            {category === 'privacy' && (
                <PrivacySettingsTab
                    settings={settings.privacy}
                    onUpdate={(updates) => onSettingsUpdate('privacy', updates)}
                />
            )}
            {category === 'application' && (
                <ApplicationSettingsTab
                    settings={settings.application}
                    onUpdate={(updates) =>
                        onSettingsUpdate('application', updates)
                    }
                />
            )}
            {category === 'security' && (
                <SecuritySettingsTab
                    settings={settings.security}
                    onUpdate={(updates) =>
                        onSettingsUpdate('security', updates)
                    }
                />
            )}
            {category === 'advanced' && (
                <AdvancedSettingsTab
                    settings={settings.advanced}
                    onUpdate={(updates) =>
                        onSettingsUpdate('advanced', updates)
                    }
                />
            )}
        </TabsContent>
    );

    if (isMobile) {
        return (
            <div className="xl:hidden">
                {tabContent('general')}
                {tabContent('notifications')}
                {tabContent('privacy')}
                {tabContent('application')}
                {tabContent('security')}
                {tabContent('advanced')}
            </div>
        );
    }

    return (
        <div className="xl:col-span-3">
            {tabContent('general')}
            {tabContent('notifications')}
            {tabContent('privacy')}
            {tabContent('application')}
            {tabContent('security')}
            {tabContent('advanced')}
        </div>
    );
}
