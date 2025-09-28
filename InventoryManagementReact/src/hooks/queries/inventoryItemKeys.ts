// Query keys for inventory items
export const inventoryItemKeys = {
    all: ['inventory-items'] as const,
    lists: () => [...inventoryItemKeys.all, 'list'] as const,
    list: (filters: string) =>
        [...inventoryItemKeys.lists(), { filters }] as const,
    details: () => [...inventoryItemKeys.all, 'detail'] as const,
    detail: (id: number) => [...inventoryItemKeys.details(), id] as const,
};
