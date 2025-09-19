import type { InventoryItemResponseDto } from '@/types/inventoryItem';
import InventoryItemCard from '@/components/cards/InventoryItemCard';

interface InventoryGridViewProps {
    items: InventoryItemResponseDto[];
    isStorekeeper: boolean;
    onEdit: (item: InventoryItemResponseDto) => void;
    onDelete: (item: InventoryItemResponseDto) => void;
    onAddToCart: (item: InventoryItemResponseDto) => void;
    onViewDetails: (item: InventoryItemResponseDto) => void;
}

export function InventoryGridView({
    items,
    isStorekeeper,
    onEdit,
    onDelete,
    onAddToCart,
    onViewDetails,
}: InventoryGridViewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
                <InventoryItemCard
                    key={item.id}
                    item={item}
                    isStorekeeperView={isStorekeeper}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
}
