import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Filter } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface RequestHeaderProps {
    title: string;
    totalRequests: number;
    isLoading: boolean;
    onRefresh: () => void;
    onSearch?: (query: string) => void;
    onFilter?: () => void;
    showFilters?: boolean;
    searchQuery?: string;
}

export default function RequestHeader({
    title,
    totalRequests,
    isLoading,
    onRefresh,
    onFilter,
    showFilters = false,
}: RequestHeaderProps) {
    const { hasPermission } = usePermissions();

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {title}
                </h1>
                <p className="text-muted-foreground">
                    Manage and track inventory requests
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-sm">
                    {totalRequests} requests
                </Badge>
                <Button
                    variant="outline"
                    onClick={onRefresh}
                    disabled={isLoading}
                    aria-label="Refresh requests data"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
                {showFilters && hasPermission('VIEW_REQUESTS') && (
                    <Button
                        variant="outline"
                        onClick={onFilter}
                        aria-label="Filter requests"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                )}
            </div>
        </div>
    );
}
