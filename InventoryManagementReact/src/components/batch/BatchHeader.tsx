import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Plus } from 'lucide-react';

interface BatchHeaderProps {
    title: string;
    totalBatches: number;
    isLoading: boolean;
    onRefresh: () => void;
    onCreateBatch: () => void;
}

export default function BatchHeader({
    title,
    totalBatches,
    isLoading,
    onRefresh,
    onCreateBatch,
}: BatchHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {title}
                </h1>
                <p className="text-muted-foreground">
                    Manage inventory batches and stock levels
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-sm">
                    {totalBatches} batches
                </Badge>
                <Button
                    variant="outline"
                    onClick={onRefresh}
                    disabled={isLoading}
                    aria-label="Refresh batches data"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
                <Button
                    onClick={onCreateBatch}
                    aria-label="Create new batch"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Batch
                </Button>
            </div>
        </div>
    );
}
