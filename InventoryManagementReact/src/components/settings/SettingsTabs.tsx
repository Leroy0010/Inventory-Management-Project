import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Settings as SettingsIcon,
    Bell,
    Eye,
    Monitor,
    Shield,
    Zap,
} from 'lucide-react';
import type { SettingsCategory } from '@/types/settings';

interface SettingsTabsProps {
    activeTab: SettingsCategory;
    onTabChange: (tab: SettingsCategory) => void;
    availableTabs: SettingsCategory[];
}

const tabConfig = {
    general: {
        label: 'General',
        icon: SettingsIcon,
        description: 'Basic preferences and appearance',
    },
    notifications: {
        label: 'Notifications',
        icon: Bell,
        description: 'Email and push notification settings',
    },
    privacy: {
        label: 'Privacy',
        icon: Eye,
        description: 'Data sharing and visibility controls',
    },
    application: {
        label: 'Application',
        icon: Monitor,
        description: 'Interface and behavior settings',
    },
    security: {
        label: 'Security',
        icon: Shield,
        description: 'Authentication and security preferences',
    },
    advanced: {
        label: 'Advanced',
        icon: Zap,
        description: 'Developer and integration settings',
    },
};

export function SettingsTabs({
    activeTab,
    onTabChange,
    availableTabs,
}: SettingsTabsProps) {
    return (
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {availableTabs.map((tab) => {
                const config = tabConfig[tab];
                const Icon = config.icon;

                return (
                    <TabsTrigger
                        key={tab}
                        value={tab}
                        className="flex flex-col items-center gap-2 p-4 h-auto"
                        onClick={() => onTabChange(tab)}
                    >
                        <Icon className="h-5 w-5" />
                        <div className="text-center">
                            <div className="font-medium">{config.label}</div>
                            <div className="text-xs text-muted-foreground hidden lg:block">
                                {config.description}
                            </div>
                        </div>
                    </TabsTrigger>
                );
            })}
        </TabsList>
    );
}
