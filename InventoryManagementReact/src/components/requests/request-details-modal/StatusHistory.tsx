import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { RequestResponseDto, RequestStatus } from '@/types/request';

import type { StatusBadgeVariant } from '../RequestDetailsModal';
import { Badge } from '@/components/ui/badge';

interface StatusHistoryProps {
    request: RequestResponseDto;
    getStatusBadgeVariant: (status: RequestStatus) => StatusBadgeVariant;
    formatDate: (date: Date) => string;
}

export default function StatusHistory({
    request,
    getStatusBadgeVariant,
    formatDate,
}: StatusHistoryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Changed By</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {request.statusHistory.map((history) => (
                            <TableRow key={history.id}>
                                <TableCell>
                                    <Badge
                                        variant={getStatusBadgeVariant(
                                            history.statusName
                                        )}
                                    >
                                        {history.statusName}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {history.changedBy.firstName}{' '}
                                    {history.changedBy.lastName}
                                </TableCell>
                                <TableCell>
                                    {formatDate(history.timestamp)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
