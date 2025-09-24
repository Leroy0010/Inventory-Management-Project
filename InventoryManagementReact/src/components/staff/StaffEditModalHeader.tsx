import { DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';

export function StaffEditModalHeader() {
    return (
        <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Staff Member
        </DialogTitle>
    );
}
