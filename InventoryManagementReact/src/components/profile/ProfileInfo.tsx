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
            <span className="text-sm text-gray-600">{profile.departmentName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Office</span>
            <span className="text-sm text-gray-600">{profile.officeName}</span>
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

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last Login
            </span>
            <span className="text-sm text-gray-600">
              {formatDate(profile.lastLoginAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
