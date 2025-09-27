import type { SecuritySettings } from '@/types/settings';
import { TwoFactorAuthentication } from './TwoFactorAuthentication';
import { SessionManagement } from './SessionManagement';
import { PasswordPolicy } from './PasswordPolicy';
import { ApiAccess } from './ApiAccess';
import { SecurityActions } from './SecurityActions';

interface SecuritySettingsTabProps {
    settings: SecuritySettings;
    onUpdate: (settings: Partial<SecuritySettings>) => void;
    isLoading?: boolean;
}

export function SecuritySettingsTab({
    settings,
    onUpdate,
    isLoading,
}: SecuritySettingsTabProps) {
    return (
        <div className="space-y-6">
            <TwoFactorAuthentication
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <SessionManagement
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <PasswordPolicy
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <ApiAccess
                settings={settings}
                onUpdate={onUpdate}
                isLoading={isLoading}
            />
            <SecurityActions />
        </div>
    );
}
