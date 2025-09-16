import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Building, Phone, Mail, FileText, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToggleStaffStatus, useDeleteStaff } from '@/hooks/queries/useStaff';
import type { Staff } from '@/types/staff';

interface StaffViewModalProps {
  staff: Staff | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (staff: Staff) => void;
}

export function StaffViewModal({ staff, isOpen, onClose, onEdit }: StaffViewModalProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toggleStatusMutation = useToggleStaffStatus();
  const deleteStaffMutation = useDeleteStaff();

  const handleToggleStatus = async () => {
    if (!staff) return;

    setIsToggling(true);
    try {
      await toggleStatusMutation.mutateAsync({
        id: staff.id,
        active: !staff.active,
      });
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!staff) return;

    if (window.confirm(`Are you sure you want to delete "${staff.firstName} ${staff.lastName}"?`)) {
      setIsDeleting(true);
      try {
        await deleteStaffMutation.mutateAsync(staff.id);
        onClose();
      } catch (error) {
        // Error is handled by the mutation
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (staff) {
      onEdit(staff);
      onClose();
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {staff.firstName} {staff.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Staff Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Staff Information</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleStatus}
                      disabled={isToggling}
                      className="flex items-center gap-2"
                    >
                      {staff.active ? (
                        <ToggleRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-gray-400" />
                      )}
                      {isToggling ? 'Updating...' : (staff.active ? 'Deactivate' : 'Activate')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled // disabled={isDeleting}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <p className="text-sm font-medium">{staff.firstName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <p className="text-sm font-medium">{staff.lastName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </label>
                    <p className="text-sm">{staff.email}</p>
                  </div>

                  {staff.phone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Phone
                      </label>
                      <p className="text-sm">{staff.phone}</p>
                    </div>
                  )}

                  {staff.officeName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        Office
                      </label>
                      <p className="text-sm">{staff.officeName}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={staff.active ? 'default' : 'secondary'} className="mt-1">
                      {staff.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                {staff.bio && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Bio
                    </label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                      {staff.bio}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
