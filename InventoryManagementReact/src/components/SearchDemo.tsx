import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/SearchBar';
import { useSearch } from '@/contexts/SearchContext';
import { Search, Keyboard, MousePointer, Zap } from 'lucide-react';

export function SearchDemo() {
  const { searchResults, searchQuery } = useSearch();

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Search across all pages, features, and actions',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    {
      icon: Keyboard,
      title: 'Keyboard Navigation',
      description: 'Use arrow keys, Enter, and Escape for navigation',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    {
      icon: MousePointer,
      title: 'Click to Navigate',
      description: 'Click any result to navigate to that page',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    {
      icon: Zap,
      title: 'Quick Access',
      description: 'Use Ctrl+/ to quickly focus the search',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
  ];

  const searchTips = [
    'Try searching for "dashboard" to find dashboard pages',
    'Search "inventory" to find inventory-related features',
    'Type "reports" to see all reporting options',
    'Search "staff" to find staff management tools',
    'Use "settings" to find configuration options'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Functionality Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Try the search:</h3>
            <SearchBar />
          </div>

          {/* Current Results */}
          {searchQuery && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Search Results ({searchResults.length})
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.slice(0, 3).map((result) => (
                      <div key={result.id} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                        <span className="font-medium">{result.title}</span>
                        <span className="text-muted-foreground">- {result.description}</span>
                      </div>
                    ))}
                    {searchResults.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        ... and {searchResults.length - 3} more results
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No results found</p>
                )}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <feature.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Search Tips:</h3>
            <div className="space-y-1">
              {searchTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Keyboard Shortcuts:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800">
                <span>Focus search</span>
                <Badge variant="outline">Ctrl + /</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800">
                <span>Navigate results</span>
                <Badge variant="outline">↑ ↓</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800">
                <span>Select result</span>
                <Badge variant="outline">Enter</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800">
                <span>Close search</span>
                <Badge variant="outline">Esc</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
