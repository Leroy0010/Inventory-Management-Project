import { cn } from '@/lib/utils';

interface DataTableErrorProps {
    error: string;
    className?: string;
}

export function DataTableError({ error, className }: DataTableErrorProps) {
    return (
        <div className={cn('flex items-center justify-center p-8', className)}>
            <div className="text-center">
                <p className="text-destructive mb-2">Error loading data</p>
                <p className="text-sm text-muted-foreground">{error}</p>
            </div>
        </div>
    );
}
