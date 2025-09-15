import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, MapPin, FileText, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useOfficeById } from '@/hooks/queries/useOffice';
import { useDeleteOffice } from '@/hooks/queries/useOffice';
import { OfficeEditModal } from '@/components/office/OfficeEditModal';

export default function OfficeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const officeId = id ? parseInt(id) : 0;
  const { data: office, isLoading, error } = useOfficeById(officeId);
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
        navigate('/office');
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
            onClick={() => navigate('/office')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Loading...</h1>
            <p className="text-muted-foreground">Loading office details</p>
          </div>
        </div>
        <div className="text-center py-12">
          <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading office information...</p>
        </div>
      </div>
    );
  }

  if (error || !office) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/office')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Office Not Found</h1>
            <p className="text-muted-foreground">The requested office could not be found</p>
          </div>
        </div>
        <div className="text-center py-12">
          <Building className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Office</h3>
          <p className="text-red-500">Failed to load office details. Please try again.</p>
          <Button
            onClick={() => navigate('/office')}
            className="mt-4"
          >
            Back to Offices
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
            onClick={() => navigate('/office')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{office.name}</h1>
            <p className="text-muted-foreground">Office Details</p>
          </div>
        </div>
        <div className="flex gap-2">
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
            disabled={isDeleting || office.staffCount > 0}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Office Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Office Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Office Name</label>
              <p className="text-sm font-medium mt-1">{office.name}</p>
            </div>

            {office.location && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Location
                </label>
                <p className="text-sm mt-1">{office.location}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                Staff Count
              </label>
              <Badge variant="outline" className="flex items-center gap-1 w-fit mt-1">
                <Users className="w-3 h-3" />
                {office.staffCount} {office.staffCount === 1 ? 'member' : 'members'}
              </Badge>
            </div>
          </div>

          {office.description && (
            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Description
              </label>
              <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                {office.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {office.staffCount > 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                This office has {office.staffCount} staff {office.staffCount === 1 ? 'member' : 'members'}.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                View staff details in the Staff management section.
              </p>
              <Button
                onClick={() => navigate('/staff')}
                className="mt-4"
              >
                View Staff
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No staff members assigned to this office.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add staff members in the Staff management section.
              </p>
              <Button
                onClick={() => navigate('/staff/add')}
                className="mt-4"
              >
                Add Staff
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <OfficeEditModal
        office={office}
        isOpen={showEditModal}
        onClose={handleEditClose}
      />
    </div>
  );
}
