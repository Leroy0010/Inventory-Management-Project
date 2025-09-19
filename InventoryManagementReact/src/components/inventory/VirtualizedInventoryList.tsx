import React, { memo, useCallback } from 'react';
import { VirtualizedList } from '@/components/ui/VirtualizedList';
import InventoryItemCard from '@/components/cards/InventoryItemCard';
import type { InventoryItemResponseDto } from '@/types/inventoryItem';

interface VirtualizedInventoryListProps {
  items: InventoryItemResponseDto[];
  isStorekeeperView: boolean;
  onEdit: (item: InventoryItemResponseDto) => void;
  onDelete: (item: InventoryItemResponseDto) => void;
  onAddToCart: (item: InventoryItemResponseDto) => void;
  onViewDetails: (item: InventoryItemResponseDto) => void;
  height?: number;
  itemHeight?: number;
}

const VirtualizedInventoryList = memo(function VirtualizedInventoryList({
  items,
  isStorekeeperView,
  onEdit,
  onDelete,
  onAddToCart,
  onViewDetails,
  height = 600,
  itemHeight = 420, // Height of each inventory card
}: VirtualizedInventoryListProps) {
  const renderItem = useCallback(
    ({ index, data }: { index: number; data: InventoryItemResponseDto }) => (
      <div className="p-2">
        <InventoryItemCard
          item={data}
          isStorekeeperView={isStorekeeperView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
          className="w-full"
        />
      </div>
    ),
    [isStorekeeperView, onEdit, onDelete, onAddToCart, onViewDetails]
  );

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No items to display</p>
      </div>
    );
  }

  return (
    <VirtualizedList
      items={items}
      height={height}
      itemHeight={itemHeight}
      renderItem={renderItem}
      className="rounded-lg border border-gray-200 dark:border-gray-700"
    />
  );
});

export default VirtualizedInventoryList;
