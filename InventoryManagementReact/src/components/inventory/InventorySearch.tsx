import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Grid3X3, List, Search } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface InventorySearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

export function InventorySearch({
    searchTerm,
    onSearchChange,
    viewMode,
    onViewModeChange,
}: InventorySearchProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Search & Filter</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search items by name, unit, department, or ID..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="max-w-md"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant={
                                viewMode === 'grid' ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => onViewModeChange('grid')}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === 'list' ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => onViewModeChange('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
