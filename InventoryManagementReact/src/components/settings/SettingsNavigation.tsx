import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SettingsTabs } from './SettingsTabs';
import type { SettingsCategory } from '@/types/settings';

interface SettingsNavigationProps {
    activeTab: SettingsCategory;
    onTabChange: (tab: SettingsCategory) => void;
    availableTabs: SettingsCategory[];
    isMobile?: boolean;
}

export function SettingsNavigation({
    activeTab,
    onTabChange,
    availableTabs,
    isMobile = false,
}: SettingsNavigationProps) {
    if (isMobile) {
        return (
            <div className="xl:hidden">
                <Card>
                    <CardContent className="pt-6">
                        <SettingsTabs
                            activeTab={activeTab}
                            onTabChange={onTabChange}
                            availableTabs={availableTabs}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="xl:col-span-1">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Settings</CardTitle>
                    <CardDescription>
                        Choose a category to configure
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <SettingsTabs
                        activeTab={activeTab}
                        onTabChange={onTabChange}
                        availableTabs={availableTabs}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
