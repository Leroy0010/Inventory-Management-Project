import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StaffList } from '@/components/staff/StaffList';
import { StaffViewModal } from '@/components/staff/StaffViewModal';
import { StaffEditModal } from '@/components/staff/StaffEditModal';
import { useStaff } from '@/hooks/queries/useStaff';
import type { Staff } from '@/types/staff';

export default function Staff() {
    const navigate = useNavigate();
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const { data: staff = [], isLoading, error } = useStaff();

    const handleEdit = (staff: Staff) => {
        setSelectedStaff(staff);
        setShowEditModal(true);
    };

    const handleView = (staff: Staff) => {
        setSelectedStaff(staff);
        setShowViewModal(true);
    };

    const handleEditClose = () => {
        setShowEditModal(false);
        setSelectedStaff(null);
    };

    const handleViewClose = () => {
        setShowViewModal(false);
        setSelectedStaff(null);
    };

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Staff Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your team members and their roles
                        </p>
                    </div>
                    <Button onClick={() => navigate("/staff/add")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Staff
                    </Button>
                </div>
                <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Staff</h3>
                    <p className="text-red-500">Failed to load staff members. Please try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Staff Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your team members and their roles
                    </p>
                </div>
                <Button onClick={() => navigate("/staff/add")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff
                </Button>
            </div>

            <StaffList
                staff={staff}
                isLoading={isLoading}
                onEdit={handleEdit}
                onView={handleView}
            />

            {/* Modals */}
            <StaffViewModal
                staff={selectedStaff}
                isOpen={showViewModal}
                onClose={handleViewClose}
                onEdit={handleEdit}
            />
            <StaffEditModal
                staff={selectedStaff}
                isOpen={showEditModal}
                onClose={handleEditClose}
            />
        </div>
    );
}
