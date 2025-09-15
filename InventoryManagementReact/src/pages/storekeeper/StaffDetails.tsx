import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building, Phone, Mail, FileText, Edit, Trash2, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { useStaffById } from '@/hooks/queries/useStaff';
import { useToggleStaffStatus, useDeleteStaff } from '@/hooks/queries/useStaff';
import { StaffEditModal } from '@/components/staff/StaffEditModal';

export default function StaffDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const staffId = id ? parseInt(id) : 0;
  const { data: staff, isLoading, error } = useStaffById(staffId);
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
        navigate('/staff');
      } catch (error) {
        // Error is handled by the mutation
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/staff')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Loading...</h1>
            <p className="text-muted-foreground">Loading staff details</p>
          </div>
        </div>
        <div className="text-center py-12">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading staff information...</p>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/staff')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Staff Not Found</h1>
            <p className="text-muted-foreground">The requested staff member could not be found</p>
          </div>
        </div>
        <div className="text-center py-12">
          <User className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Staff</h3>
          <p className="text-red-500">Failed to load staff details. Please try again.</p>
          <Button
            onClick={() => navigate('/staff')}
            className="mt-4"
          >
            Back to Staff
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/staff')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{staff.firstName} {staff.lastName}</h1>
            <p className="text-muted-foreground">Staff Member Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
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
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Staff Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Staff Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <p className="text-sm font-medium mt-1">{staff.firstName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <p className="text-sm font-medium mt-1">{staff.lastName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email
              </label>
              <p className="text-sm mt-1">{staff.email}</p>
            </div>

            {staff.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone
                </label>
                <p className="text-sm mt-1">{staff.phone}</p>
              </div>
            )}

            {staff.officeName && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  Office
                </label>
                <p className="text-sm mt-1">{staff.officeName}</p>
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
            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Bio
              </label>
              <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                {staff.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <StaffEditModal
        staff={staff}
        isOpen={showEditModal}
        onClose={handleEditClose}
      />
    </div>
  );
}
