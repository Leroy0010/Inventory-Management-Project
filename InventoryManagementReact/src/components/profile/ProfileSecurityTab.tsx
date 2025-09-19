import { TabsContent } from '@/components/ui/tabs';
import { PasswordChangeForm } from './PasswordChangeForm';

interface ProfileSecurityTabProps {
    onPasswordChange?: () => void;
}

export function ProfileSecurityTab({
    onPasswordChange,
}: ProfileSecurityTabProps) {
    return (
        <TabsContent value="security" className="space-y-6">
            <div className="max-w-2xl">
                <PasswordChangeForm onSuccess={onPasswordChange} />
            </div>
        </TabsContent>
    );
}
