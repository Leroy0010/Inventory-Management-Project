import { Button } from '@/components/ui/button';
import { Package, ArrowLeft } from 'lucide-react';

interface InventoryItemDetailsErrorProps {
    onBack: () => void;
    errorMessage?: string;
}

export function InventoryItemDetailsError({
    onBack,
    errorMessage,
}: InventoryItemDetailsErrorProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>
            <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Item Not Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {errorMessage ||
                        'The requested inventory item could not be found.'}
                </p>
                <Button onClick={onBack}>Go Back</Button>
            </div>
        </div>
    );
}
