import { Button } from '@/components/ui/button';

interface OfficeViewModalActionsProps {
    onClose: () => void;
}

export function OfficeViewModalActions({
    onClose,
}: OfficeViewModalActionsProps) {
    return (
        <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
        </div>
    );
}
