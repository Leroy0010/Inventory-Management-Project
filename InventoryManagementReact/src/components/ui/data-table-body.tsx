import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Column } from './data-table-header';

interface DataTableBodyProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
}

export function DataTableBody<T>({
    data,
    columns,
    onRowClick,
    emptyMessage = 'No data available',
}: DataTableBodyProps<T>) {
    if (data.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="text-center py-8"
                    >
                        <p className="text-muted-foreground">{emptyMessage}</p>
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }

    return (
        <TableBody>
            {data.map((item, index) => (
                <TableRow
                    key={index}
                    className={cn(
                        onRowClick && 'cursor-pointer hover:bg-muted/50'
                    )}
                    onClick={() => onRowClick?.(item)}
                >
                    {columns.map((column) => (
                        <TableCell
                            key={String(column.key)}
                            className={column.className}
                        >
                            {column.accessor
                                ? column.accessor(item)
                                : (item as any)[column.key]}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    );
}
