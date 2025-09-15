import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MoreVertical, 
  Edit, 
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Staff } from '@/types/staff';
import { useToggleStaffStatus, useDeleteStaff } from '@/hooks/queries/useStaff';
import { useState } from 'react';

interface StaffCardProps {
  staff: Staff;
  onEdit?: (staff: Staff) => void;
  onView?: (staff: Staff) => void;
}

export function StaffCard({ staff, onEdit, onView }: StaffCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const toggleStatusMutation = useToggleStaffStatus();
  const deleteStaffMutation = useDeleteStaff();

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      await toggleStatusMutation.mutateAsync({
        id: staff.id,
        active: !staff.active,
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to deactivate this staff member?')) {
      await deleteStaffMutation.mutateAsync(staff.id);
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${!staff.active ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{staff.firstName} {staff.lastName}</h3>
              <p className="text-sm text-muted-foreground">Staff Member</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={staff.active ? 'default' : 'secondary'}>
              {staff.active ? (
                <>
                  <UserCheck className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <UserX className="w-3 h-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(staff)}>
                  <User className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(staff)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deactivate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{staff.email}</span>
          </div>
          {staff.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{staff.phone}</span>
            </div>
          )}
          {staff.officeName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="w-4 h-4" />
              <span>{staff.officeName}</span>
            </div>
          )}
          {staff.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">{staff.bio}</p>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Switch
              checked={staff.active}
              onCheckedChange={handleToggleStatus}
              disabled={isToggling || toggleStatusMutation.isPending}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
