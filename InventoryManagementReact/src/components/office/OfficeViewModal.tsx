import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Users, MapPin, FileText, Edit, Trash2 } from 'lucide-react';
import { useOfficeById } from '@/hooks/queries/useOffice';
import { useDeleteOffice } from '@/hooks/queries/useOffice';
import type { Office } from '@/types/office';

interface OfficeViewModalProps {
  office: Office | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (office: Office) => void;
}

export function OfficeViewModal({ office, isOpen, onClose, onEdit }: OfficeViewModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteOfficeMutation = useDeleteOffice();

  const handleDelete = async () => {
    if (!office) return;
    
    if (office.staffCount > 0) {
      alert('Cannot delete office with staff members. Please reassign staff first.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${office.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteOfficeMutation.mutateAsync(office.id);
        onClose();
      } catch (error) {
        // Error is handled by the mutation
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (office) {
      onEdit(office);
      onClose();
    }
  };

  if (!office) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            {office.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Office Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Office Information</h3>
                  <div className="flex gap-2">
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
                      disabled={isDeleting || office.staffCount > 0}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Office Name</label>
                    <p className="text-sm font-medium">{office.name}</p>
                  </div>

                  {office.location && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Location
                      </label>
                      <p className="text-sm">{office.location}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Staff Count
                    </label>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Users className="w-3 h-3" />
                      {office.staffCount} {office.staffCount === 1 ? 'member' : 'members'}
                    </Badge>
                  </div>
                </div>

                {office.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Description
                    </label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                      {office.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Staff Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Staff Members</h3>
                
                {office.staffCount > 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      This office has {office.staffCount} staff {office.staffCount === 1 ? 'member' : 'members'}.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      View staff details in the Staff management section.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No staff members assigned to this office.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add staff members in the Staff management section.
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
