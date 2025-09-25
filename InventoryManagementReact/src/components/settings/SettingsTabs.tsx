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
        <>
            {/* Desktop Vertical Layout */}
            <div className="hidden xl:block space-y-1">
                {availableTabs.map((tab) => {
                    const config = tabConfig[tab];
                    const Icon = config.icon;
                    const isActive = activeTab === tab;

                    return (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">
                                    {config.label}
                                </div>
                                <div
                                    className={`text-xs ${
                                        isActive
                                            ? 'text-primary-foreground/70'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {config.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Mobile Horizontal Layout */}
            <div className="xl:hidden">
                <div className="flex space-x-1 overflow-x-auto pb-2">
                    {availableTabs.map((tab) => {
                        const config = tabConfig[tab];
                        const Icon = config.icon;
                        const isActive = activeTab === tab;

                        return (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {config.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
