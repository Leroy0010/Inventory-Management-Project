import type { AdvancedSettings } from '@/types/settings';
import { ApiConfiguration } from './ApiConfiguration';
import { IntegrationsSettings } from './IntegrationsSettings';
import { DebugLoggingSettings } from './DebugLoggingSettings';
import { PerformanceSettings } from './PerformanceSettings';
import { ExperimentalFeaturesSettings } from './ExperimentalFeaturesSettings';
import { DeveloperTools } from './DeveloperTools';

interface AdvancedSettingsTabProps {
    settings: AdvancedSettings;
    onUpdate: (settings: Partial<AdvancedSettings>) => void;
    isLoading?: boolean;
}

export function AdvancedSettingsTab({
    settings,
    onUpdate,
    isLoading,
}: AdvancedSettingsTabProps) {
    return (
        <div className="space-y-6">
            <ApiConfiguration
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <IntegrationsSettings
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <DebugLoggingSettings
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <PerformanceSettings
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <ExperimentalFeaturesSettings
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <DeveloperTools />
        </div>
    );
}
