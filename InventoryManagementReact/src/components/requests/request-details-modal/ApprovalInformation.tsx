import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RequestResponseDto } from '@/types/request';

interface ApprovalInformationProps {
    request: RequestResponseDto;
    formatDate: (dateString: string) => string;
}

export default function ApprovalInformation({
    request,
    formatDate,
}: ApprovalInformationProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Approval Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Approved By
                        </label>
                        <p className="text-sm">
                            {request.approver?.firstName}{' '}
                            {request.approver?.lastName}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Approved At
                        </label>
                        <p className="text-sm">
                            {formatDate(request.approvedAt!)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
