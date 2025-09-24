import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useToggleStaffStatus, useDeleteStaff } from '@/hooks/queries/useStaff';
import type { Staff } from '@/types/staff';
import { StaffViewModalHeader } from './StaffViewModalHeader';
import { StaffViewModalInfo } from './StaffViewModalInfo';
import { StaffViewModalActions } from './StaffViewModalActions';

interface StaffViewModalProps {
    staff: Staff | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (staff: Staff) => void;
}

export function StaffViewModal({
    staff,
    isOpen,
    onClose,
    onEdit,
}: StaffViewModalProps) {
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

        if (
            window.confirm(
                `Are you sure you want to delete "${staff.firstName} ${staff.lastName}"?`
            )
        ) {
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
                    <StaffViewModalHeader staff={staff} />
                </DialogHeader>

                <div className="space-y-6">
                    <StaffViewModalInfo
                        staff={staff}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                        isToggling={isToggling}
                        isDeleting={isDeleting}
                    />
                </div>

                <StaffViewModalActions onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
}
