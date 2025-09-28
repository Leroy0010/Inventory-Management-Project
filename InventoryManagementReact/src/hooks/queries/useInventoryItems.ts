// Barrel exports for all inventory item-related hooks
export { useInventoryItems } from './useInventoryItemsList';
export { useInventoryItem } from './useInventoryItem';
export { useCreateInventoryItem } from './useCreateInventoryItem';
export { useUpdateInventoryItem } from './useUpdateInventoryItem';
export { useDeleteInventoryItem } from './useDeleteInventoryItem';
export { useInventoryBalance } from './useInventoryBalance';
export { inventoryItemKeys } from './inventoryItemKeys';

import { useInventoryItems } from './useInventoryItemsList';
import { useInventoryItem } from './useInventoryItem';
import { useCreateInventoryItem } from './useCreateInventoryItem';
import { useUpdateInventoryItem } from './useUpdateInventoryItem';
import { useDeleteInventoryItem } from './useDeleteInventoryItem';

// Legacy export for backward compatibility
export function useInventoryItemQueries() {
    // This is now deprecated - components should use individual hooks
    console.warn(
        'useInventoryItemQueries is deprecated. Use individual hooks like useInventoryItems, useCreateInventoryItem, etc.'
    );

    return {
        itemsQuery: useInventoryItems(),
        useItemQuery: useInventoryItem,
        createItemMutation: useCreateInventoryItem(),
        updateItemMutation: useUpdateInventoryItem(),
        deleteItemMutation: useDeleteInventoryItem(),
    };
}
