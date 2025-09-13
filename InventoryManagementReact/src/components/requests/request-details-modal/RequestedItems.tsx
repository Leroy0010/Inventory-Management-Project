import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import type { RequestResponseDto } from '@/types/request';

interface RequestedItemsProps {
    request: RequestResponseDto;
}

export default function RequestedItems({ request }: RequestedItemsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Requested Items</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {request.items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {item.quantity}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
