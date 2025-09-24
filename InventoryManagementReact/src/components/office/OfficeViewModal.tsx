import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useDeleteOffice } from '@/hooks/queries/useOffice';
import type { Office } from '@/types/office';
import { OfficeViewModalHeader } from './OfficeViewModalHeader';
import { OfficeViewModalInfo } from './OfficeViewModalInfo';
import { OfficeViewModalStaff } from './OfficeViewModalStaff';
import { OfficeViewModalActions } from './OfficeViewModalActions';

interface OfficeViewModalProps {
    office: Office | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (office: Office) => void;
}

export function OfficeViewModal({
    office,
    isOpen,
    onClose,
    onEdit,
}: OfficeViewModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteOfficeMutation = useDeleteOffice();

    const handleDelete = async () => {
        if (!office) return;

        if (office.staffCount > 0) {
            alert(
                'Cannot delete office with staff members. Please reassign staff first.'
            );
            return;
        }

        if (
            window.confirm(`Are you sure you want to delete "${office.name}"?`)
        ) {
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
                    <OfficeViewModalHeader office={office} />
                </DialogHeader>

                <div className="space-y-6">
                    <OfficeViewModalInfo
                        office={office}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />

                    <OfficeViewModalStaff office={office} />
                </div>

                <OfficeViewModalActions onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
}
