import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface InventoryHeaderProps {
    isStorekeeper: boolean;
    onAddClick: () => void;
}

export function InventoryHeader({
    isStorekeeper,
    onAddClick,
}: InventoryHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Inventory Items
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your inventory items and track stock levels
                </p>
            </div>
            {isStorekeeper && (
                <Button
                    onClick={onAddClick}
                    className="flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Item</span>
                </Button>
            )}
        </div>
    );
}
