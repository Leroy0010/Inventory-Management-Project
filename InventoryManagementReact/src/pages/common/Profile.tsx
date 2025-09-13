import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  Shield, 
  Settings, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { useProfileQueries } from '@/hooks/queries/useProfile';
import { useAuthStore } from '@/stores/authStore';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const { user, setUser } = useAuthStore();
  const { getProfile, updateProfile, changePassword } = useProfileQueries();

  const handleProfileUpdate = () => {
    // Refetch profile data to get updated information
    getProfile.refetch();
  };

  const handlePasswordChange = () => {
    // Optionally show success message or redirect
    console.log('Password changed successfully');
  };

  if (getProfile.isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences.</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (getProfile.error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences.</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile information. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const profile = getProfile.data;

  if (!profile) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences.</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No profile information available.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your account settings, personal information, and security preferences.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfileForm
              profile={profile}
              onSuccess={handleProfileUpdate}
            />
            <ProfileInfo profile={profile} />
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="max-w-2xl">
            <PasswordChangeForm
              onSuccess={handlePasswordChange}
            />
          </div>
        </TabsContent>

        {/* Account Tab */}
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
                    For additional account settings or support, please contact your administrator.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}