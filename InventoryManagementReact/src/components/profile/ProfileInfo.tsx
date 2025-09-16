import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Calendar, 
  Clock,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { UserProfile } from '@/types/profile';

interface ProfileInfoProps {
  profile: UserProfile;
  className?: string;
}

export function ProfileInfo({ profile, className = '' }: ProfileInfoProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className={className}>
      {/* Personal Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          <CardDescription>
            Your personal details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">User ID</span>
            <span className="text-sm text-gray-600 font-mono">#{profile.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Full Name</span>
            <span className="text-sm text-gray-600">{profile.firstName} {profile.lastName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </span>
            <span className="text-sm text-gray-600">{profile.email}</span>
          </div>

          {profile.phone && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </span>
              <span className="text-sm text-gray-600">{profile.phone}</span>
            </div>
          )}

          {profile.bio && (
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Bio
              </span>
              <span className="text-sm text-gray-600 text-right max-w-xs">{profile.bio}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Account Status</CardTitle>
          </div>
          <CardDescription>
            Your account information and status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={profile.active ? 'default' : 'destructive'}>
              {profile.active ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Inactive
                </div>
              )}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Role</span>
            <Badge variant="outline">{profile.roleName}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Department</span>
            <span className="text-sm text-gray-600">{profile.departmentName || 'Not assigned'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Office</span>
            <span className="text-sm text-gray-600">{profile.officeName || 'Not assigned'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Activity Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Activity Information</CardTitle>
          </div>
          <CardDescription>
            Your account activity and login information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Member Since
            </span>
            <span className="text-sm text-gray-600">
              {formatDate(profile.createdAt)}
            </span>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
