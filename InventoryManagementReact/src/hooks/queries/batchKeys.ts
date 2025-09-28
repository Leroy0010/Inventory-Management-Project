// Query keys for batch operations
export const batchKeys = {
    all: ['batches'] as const,
    lists: () => [...batchKeys.all, 'list'] as const,
    list: (filters: string) => [...batchKeys.lists(), { filters }] as const,
    details: () => [...batchKeys.all, 'detail'] as const,
    detail: (id: number) => [...batchKeys.details(), id] as const,
};
