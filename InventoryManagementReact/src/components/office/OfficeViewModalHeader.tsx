import { DialogTitle } from '@/components/ui/dialog';
import { Building } from 'lucide-react';
import type { Office } from '@/types/office';

interface OfficeViewModalHeaderProps {
    office: Office;
}

export function OfficeViewModalHeader({ office }: OfficeViewModalHeaderProps) {
    return (
        <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            {office.name}
        </DialogTitle>
    );
}
