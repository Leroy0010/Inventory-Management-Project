import { DialogTitle } from '@/components/ui/dialog';
import { Building } from 'lucide-react';

export function OfficeEditModalHeader() {
    return (
        <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Edit Office
        </DialogTitle>
    );
}
