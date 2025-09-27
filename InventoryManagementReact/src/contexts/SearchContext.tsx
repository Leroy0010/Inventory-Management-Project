import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import type { SearchContextType } from '@/hooks/useSerach';
import { SearchContext } from '@/hooks/useSerach';
import { applicationData } from '@/data/searchData';
import { filterSearchResults } from '@/utils/searchUtils';

// Search result types
export interface SearchResult {
    id: string;
    title: string;
    description: string;
    category: 'page' | 'feature' | 'action';
    path: string;
    icon: string;
    keywords: string[];
    permissions?: string[];
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const { canAccess } = usePermissionCheck();

    const searchResults = useMemo(() => {
        return filterSearchResults(applicationData, searchQuery, canAccess);
    }, [searchQuery, canAccess]);

    const performSearch = (query: string) => {
        setSearchQuery(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const navigateToResult = (result: SearchResult) => {
        if (result.category === 'action' && result.id === 'logout') {
            // Handle logout action
            window.location.href = '/login';
        } else if (result.path !== '#') {
            navigate(result.path);
        }
        clearSearch();
    };

    const value: SearchContextType = {
        searchResults,
        searchQuery,
        setSearchQuery,
        performSearch,
        clearSearch,
        navigateToResult,
        isSearchOpen,
        setIsSearchOpen,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}
