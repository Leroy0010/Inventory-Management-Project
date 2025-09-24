import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface StaffEditModalActionsProps {
    onClose: () => void;
    isSubmitting: boolean;
    isPending: boolean;
}

export function StaffEditModalActions({
    onClose,
    isSubmitting,
    isPending,
}: StaffEditModalActionsProps) {
    return (
        <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
            >
                <X className="w-4 h-4 mr-2" />
                Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isPending}>
                {isSubmitting || isPending ? 'Updating...' : 'Update Staff'}
            </Button>
        </div>
    );
}
