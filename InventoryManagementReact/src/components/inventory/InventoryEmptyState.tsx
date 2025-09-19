import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

interface InventoryEmptyStateProps {
    hasSearchTerm: boolean;
    isStorekeeper: boolean;
    onAddClick: () => void;
}

export function InventoryEmptyState({
    hasSearchTerm,
    isStorekeeper,
    onAddClick,
}: InventoryEmptyStateProps) {
    return (
        <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Items Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                {hasSearchTerm
                    ? 'Try adjusting your search terms'
                    : 'No inventory items available'}
            </p>
            {isStorekeeper && !hasSearchTerm && (
                <Button onClick={onAddClick}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                </Button>
            )}
        </div>
    );
}
