import { Skeleton, SkeletonTable } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DataTableLoadingProps {
    columnsCount: number;
    className?: string;
}

export function DataTableLoading({
    columnsCount,
    className,
}: DataTableLoadingProps) {
    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
            </div>
            <div className="rounded-md border">
                <div className="p-4">
                    <SkeletonTable rows={5} columns={columnsCount} />
                </div>
            </div>
        </div>
    );
}
