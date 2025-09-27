import type { SearchResult } from '@/contexts/SearchContext';
import type { Permission } from '@/types/permissions';

export function filterSearchResults(
    data: SearchResult[],
    query: string,
    canAccess: (permissions: Permission[]) => boolean
): SearchResult[] {
    if (!query.trim()) return [];

    const searchQuery = query.toLowerCase();

    return data
        .filter((item) => {
            // Check permissions
            if (item.permissions && item.permissions.length > 0) {
                const hasPermission = canAccess(
                    item.permissions as Permission[]
                );
                if (!hasPermission) return false;
            }

            // Search in title, description, and keywords
            return (
                item.title.toLowerCase().includes(searchQuery) ||
                item.description.toLowerCase().includes(searchQuery) ||
                item.keywords.some((keyword) =>
                    keyword.toLowerCase().includes(searchQuery)
                )
            );
        })
        .sort((a, b) => {
            // Prioritize exact title matches
            const aTitleMatch = a.title.toLowerCase().includes(searchQuery);
            const bTitleMatch = b.title.toLowerCase().includes(searchQuery);

            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;

            // Then by category priority
            const categoryOrder = { page: 0, feature: 1, action: 2 };
            return categoryOrder[a.category] - categoryOrder[b.category];
        })
        .slice(0, 8); // Limit to 8 results
}
