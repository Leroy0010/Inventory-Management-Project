import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface OfficeEditModalActionsProps {
    onClose: () => void;
    isSubmitting: boolean;
    isPending: boolean;
}

export function OfficeEditModalActions({
    onClose,
    isSubmitting,
    isPending,
}: OfficeEditModalActionsProps) {
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
                {isSubmitting || isPending ? 'Updating...' : 'Update Office'}
            </Button>
        </div>
    );
}
