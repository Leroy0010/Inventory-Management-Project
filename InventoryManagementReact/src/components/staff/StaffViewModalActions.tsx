import { Button } from '@/components/ui/button';

interface StaffViewModalActionsProps {
    onClose: () => void;
}

export function StaffViewModalActions({ onClose }: StaffViewModalActionsProps) {
    return (
        <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
        </div>
    );
}
