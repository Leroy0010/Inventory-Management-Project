import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RequestResponseDto } from '@/types/request';

interface RequestSummaryProps {
    request: RequestResponseDto;
}

export function RequestSummary({ request }: RequestSummaryProps) {
    const totalQuantity = request.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Request Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <span>Total Items</span>
                    <span className="font-medium">{request.items.length}</span>
                </div>
                <div className="flex justify-between">
                    <span>Total Quantity</span>
                    <span className="font-medium">{totalQuantity}</span>
                </div>
            </CardContent>
        </Card>
    );
}
