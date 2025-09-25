import type { ApplicationSettings } from '@/types/settings';
import { InterfaceSettings } from './InterfaceSettings';
import { AutoRefreshSettings } from './AutoRefreshSettings';
import { ReportsExportSettings } from './ReportsExportSettings';
import { HelpSupportSettings } from './HelpSupportSettings';

interface ApplicationSettingsTabProps {
    settings: ApplicationSettings;
    onUpdate: (settings: Partial<ApplicationSettings>) => void;
    isLoading?: boolean;
}

export function ApplicationSettingsTab({
    settings,
    onUpdate,
    isLoading,
}: ApplicationSettingsTabProps) {
    return (
        <div className="space-y-6">
            <InterfaceSettings
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />

            <AutoRefreshSettings
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />

            <ReportsExportSettings
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />

            <HelpSupportSettings
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
        </div>
    );
}
