import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RequestResponseDto } from '@/types/request';

interface FulfillmentInformationProps {
    request: RequestResponseDto;
    formatDate: (dateString: string) => string;
}

export default function FulfillmentInformation({
    request,
    formatDate,
}: FulfillmentInformationProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Fulfillment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Fulfilled By
                        </label>
                        <p className="text-sm">
                            {request.fulfiller?.firstName}{' '}
                            {request.fulfiller?.lastName}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Fulfilled At
                        </label>
                        <p className="text-sm">
                            {formatDate(request.fulfilledAt!)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
