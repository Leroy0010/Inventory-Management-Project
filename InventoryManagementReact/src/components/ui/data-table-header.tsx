import { TableHead, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface Column<T> {
    key: keyof T | string;
    header: string;
    accessor?: (item: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    className?: string;
}

interface DataTableHeaderProps<T> {
    columns: Column<T>[];
    sortable: boolean;
    sortField: keyof T | null;
    sortDirection: 'asc' | 'desc';
    onSort: (field: keyof T) => void;
}

export function DataTableHeader<T>({
    columns,
    sortable,
    sortField,
    sortDirection,
    onSort,
}: DataTableHeaderProps<T>) {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableHead
                    key={String(column.key)}
                    className={cn(
                        column.className,
                        sortable &&
                            column.sortable !== false &&
                            'cursor-pointer hover:bg-muted/50'
                    )}
                    style={{ width: column.width }}
                    onClick={() =>
                        column.sortable !== false &&
                        onSort(column.key as keyof T)
                    }
                >
                    <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                        {sortable &&
                            column.sortable !== false &&
                            sortField === column.key && (
                                <span className="text-xs">
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                            )}
                    </div>
                </TableHead>
            ))}
        </TableRow>
    );
}
