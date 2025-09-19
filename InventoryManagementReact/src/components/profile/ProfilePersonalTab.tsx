import { TabsContent } from '@/components/ui/tabs';
import { ProfileForm } from './ProfileForm';
import { ProfileInfo } from './ProfileInfo';
import type { UserProfile } from '@/types/profile';

interface ProfilePersonalTabProps {
    profile: UserProfile;
    onProfileUpdate: () => void;
}

export function ProfilePersonalTab({
    profile,
    onProfileUpdate,
}: ProfilePersonalTabProps) {
    return (
        <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileForm profile={profile} onSuccess={onProfileUpdate} />
                <ProfileInfo profile={profile} />
            </div>
        </TabsContent>
    );
}
