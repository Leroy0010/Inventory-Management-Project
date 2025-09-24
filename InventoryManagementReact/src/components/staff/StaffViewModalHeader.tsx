import { DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import type { Staff } from '@/types/staff';

interface StaffViewModalHeaderProps {
    staff: Staff;
}

export function StaffViewModalHeader({ staff }: StaffViewModalHeaderProps) {
    return (
        <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {staff.firstName} {staff.lastName}
        </DialogTitle>
    );
}
