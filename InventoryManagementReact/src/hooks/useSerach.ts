import { useContext, createContext } from 'react';
import type { SearchResult } from '@/contexts/SearchContext';

export interface SearchContextType {
    searchResults: SearchResult[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    performSearch: (query: string) => void;
    clearSearch: () => void;
    navigateToResult: (result: SearchResult) => void;
    isSearchOpen: boolean;
    setIsSearchOpen: (open: boolean) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
    undefined
);

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}
