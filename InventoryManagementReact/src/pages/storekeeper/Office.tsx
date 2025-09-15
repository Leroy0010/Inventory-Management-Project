import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OfficeList } from '@/components/office/OfficeList';
import { OfficeViewModal } from '@/components/office/OfficeViewModal';
import { OfficeEditModal } from '@/components/office/OfficeEditModal';
import { useOffices } from '@/hooks/queries/useOffice';
import type { Office } from '@/types/office';

export default function Office() {
    const navigate = useNavigate();
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const { data: offices = [], isLoading, error } = useOffices();

    const handleEdit = (office: Office) => {
        setSelectedOffice(office);
        setShowEditModal(true);
    };

    const handleView = (office: Office) => {
        setSelectedOffice(office);
        setShowViewModal(true);
    };

    const handleEditClose = () => {
        setShowEditModal(false);
        setSelectedOffice(null);
    };

    const handleViewClose = () => {
        setShowViewModal(false);
        setSelectedOffice(null);
    };

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Office Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your office locations and branches
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/office/add')}
                        className="cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Office
                    </Button>
                </div>
                <div className="text-center py-12">
                    <Building className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Offices</h3>
                    <p className="text-red-500">Failed to load offices. Please try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Office Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your office locations and branches
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/office/add')}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Office
                </Button>
            </div>

            <OfficeList
                offices={offices}
                isLoading={isLoading}
                onEdit={handleEdit}
                onView={handleView}
            />

            {/* Modals */}
            <OfficeViewModal
                office={selectedOffice}
                isOpen={showViewModal}
                onClose={handleViewClose}
                onEdit={handleEdit}
            />
            <OfficeEditModal
                office={selectedOffice}
                isOpen={showEditModal}
                onClose={handleEditClose}
            />
        </div>
    );
}
