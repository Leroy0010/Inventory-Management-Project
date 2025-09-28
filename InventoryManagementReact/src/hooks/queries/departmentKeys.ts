// Query keys for departments
export const departmentKeys = {
    all: ['departments'] as const,
    lists: () => [...departmentKeys.all, 'list'] as const,
    list: (filters: string) =>
        [...departmentKeys.lists(), { filters }] as const,
    details: () => [...departmentKeys.all, 'detail'] as const,
    detail: (id: number) => [...departmentKeys.details(), id] as const,
};
