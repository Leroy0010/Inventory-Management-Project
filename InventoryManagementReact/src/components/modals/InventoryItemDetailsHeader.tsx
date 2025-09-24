import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface InventoryItemDetailsHeaderProps {
    onClose: () => void;
}

export function InventoryItemDetailsHeader({
    onClose,
}: InventoryItemDetailsHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Item Details
            </h2>
            <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
