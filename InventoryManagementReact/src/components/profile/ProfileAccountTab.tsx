import { TabsContent } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { ProfileInfo } from './ProfileInfo';
import type { UserProfile } from '@/types/profile';
import { Link } from 'react-router-dom';

interface ProfileAccountTabProps {
    profile: UserProfile;
}

export function ProfileAccountTab({ profile }: ProfileAccountTabProps) {
    return (
        <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileInfo profile={profile} />

                {/* Additional Account Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            <CardTitle>Account Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Additional account preferences and settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600">
                            <p>Account ID: {profile.id}</p>
                            <p>Email: {profile.email}</p>
                            <p>Role: {profile.roleName}</p>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500">
                                For additional account settings or support,
                                go to <Link to="/settings" className="hover:text-blue-500 text-blue-200">settings</Link>.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
