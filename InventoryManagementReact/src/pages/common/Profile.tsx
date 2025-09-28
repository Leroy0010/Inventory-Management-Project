import { ProfileAccountTab } from '@/components/profile/ProfileAccountTab';
import ProfileError from '@/components/profile/ProfileError';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileNoDataState } from '@/components/profile/ProfileNoDataState';
import { ProfilePersonalTab } from '@/components/profile/ProfilePersonalTab';
import { ProfileSecurityTab } from '@/components/profile/ProfileSecurityTab';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { Tabs } from '@/components/ui/tabs';
import {
    useProfile,
    useUpdateProfile,
    useChangePassword,
} from '@/hooks/queries/useAuth';
import { useState } from 'react';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('personal');

    const getProfile = useProfile();
    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();

    const handleProfileUpdate = () => {
        // Refetch profile data to get updated information
        getProfile.refetch();
    };

    const handlePasswordChange = () => {
        // Optionally show success message or redirect
        // Password changed successfully
    };

    if (getProfile.isLoading) {
        return <ProfileSkeleton />;
    }

    if (getProfile.error) {
        return <ProfileError />;
    }

    const profile = getProfile.data;

    if (!profile) {
        return <ProfileNoDataState />;
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <ProfileHeader
                title="Profile"
                description="Manage your account settings, personal information, and security preferences."
            />

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <ProfilePersonalTab
                    profile={profile}
                    onProfileUpdate={handleProfileUpdate}
                />

                <ProfileSecurityTab onPasswordChange={handlePasswordChange} />

                <ProfileAccountTab profile={profile} />
            </Tabs>
        </div>
    );
}
