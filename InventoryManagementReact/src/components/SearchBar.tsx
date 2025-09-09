import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    X,
    ArrowRight,
    Clock,
    LayoutDashboard,
    Building2,
    UserPlus,
    Package,
    ShoppingCart,
    FileText,
    Users,
    PackagePlus,
    Building,
    Layers,
    Layers3,
    Package2,
    BarChart3,
    User,
    Bell,
    MessageSquare,
    Settings,
    LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSerach';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Icon mapping for search results
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Building2,
    UserPlus,
    Package,
    ShoppingCart,
    FileText,
    Users,
    PackagePlus,
    Building,
    Layers,
    Layers3,
    Package2,
    BarChart3,
    User,
    Bell,
    MessageSquare,
    Settings,
    LogOut,
    Search,
};

export function SearchBar() {
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearchOpen,
        setIsSearchOpen,
        navigateToResult,
        clearSearch,
    } = useSearch();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Global search shortcut (Ctrl+/ or Cmd+/)
            if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                inputRef.current?.focus();
                return;
            }

            // Only handle other keys when search is open
            if (!isSearchOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < searchResults.length - 1 ? prev + 1 : 0
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev > 0 ? prev - 1 : searchResults.length - 1
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (searchResults[selectedIndex]) {
                        navigateToResult(searchResults[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    clearSearch();
                    inputRef.current?.blur();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [
        isSearchOpen,
        searchResults,
        selectedIndex,
        navigateToResult,
        clearSearch,
    ]);

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchResults]);

    // Focus input when search opens
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setIsSearchOpen(value.length > 0);
    };

    const handleResultClick = (result: any) => {
        navigateToResult(result);
    };

    const handleClear = () => {
        clearSearch();
        inputRef.current?.focus();
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'page':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'feature':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'action':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'page':
                return 'Page';
            case 'feature':
                return 'Feature';
            case 'action':
                return 'Action';
            default:
                return 'Item';
        }
    };

    return (
        <div className="relative w-full max-w-md">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search... (Ctrl+/)"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className={cn(
                        'pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400',
                        'focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                        'transition-all duration-200',
                        'text-sm sm:text-base', // Responsive text size
                        'h-9 sm:h-10' // Responsive height
                    )}
                    aria-label="Search application"
                    aria-expanded={isSearchOpen}
                    aria-haspopup="listbox"
                    role="combobox"
                    autoComplete="off"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 text-slate-400 hover:text-white"
                    >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery.length > 0 && (
                <div
                    ref={resultsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-80 sm:max-h-96 overflow-y-auto"
                    role="listbox"
                    aria-label="Search results"
                >
                    {searchResults.length > 0 ? (
                        <div className="p-2">
                            {searchResults.map((result, index) => {
                                const IconComponent =
                                    iconMap[result.icon] || Search;
                                const isSelected = index === selectedIndex;

                                return (
                                    <div
                                        key={result.id}
                                        onClick={() =>
                                            handleResultClick(result)
                                        }
                                        className={cn(
                                            'flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200',
                                            'hover:bg-slate-700/50',
                                            isSelected &&
                                                'bg-slate-700/70 ring-2 ring-blue-500/50'
                                        )}
                                        role="option"
                                        tabIndex={-1}
                                    >
                                        <div className="flex-shrink-0">
                                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                                <h4 className="text-xs sm:text-sm font-medium text-white truncate">
                                                    {result.title}
                                                </h4>
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        'text-xs px-1.5 py-0.5',
                                                        getCategoryColor(
                                                            result.category
                                                        )
                                                    )}
                                                >
                                                    {getCategoryLabel(
                                                        result.category
                                                    )}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-400 line-clamp-1 sm:line-clamp-2">
                                                {result.description}
                                            </p>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-400">
                                No results found
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Try searching for pages, features, or actions
                            </p>
                        </div>
                    )}

                    {/* Search Tips */}
                    {searchResults.length > 0 && (
                        <div className="border-t border-slate-700 p-3 bg-slate-900/50">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Clock className="w-3 h-3" />
                                <span>
                                    Use ↑↓ to navigate, Enter to select, Esc to
                                    close
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
