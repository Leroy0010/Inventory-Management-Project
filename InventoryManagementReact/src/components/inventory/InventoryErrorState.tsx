import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface InventoryErrorStateProps {
    error: unknown;
    onRetry: () => void;
}

export function InventoryErrorState({
    error,
    onRetry,
}: InventoryErrorStateProps) {
    return (
        <div className="space-y-6">
            <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Error Loading Items
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred'}
                </p>
                <Button onClick={onRetry}>Try Again</Button>
            </div>
        </div>
    );
}
