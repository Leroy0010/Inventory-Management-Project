import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, User, FileText } from 'lucide-react';
import type { RequestResponseDto } from '@/types/request';

interface RequestDetailsInfoProps {
    request: RequestResponseDto;
}

export function RequestDetailsInfo({ request }: RequestDetailsInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Request Details</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                            Requester ID
                        </Label>
                        <p className="text-lg flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>User #{request.user_id}</span>
                        </p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                            Submitted
                        </Label>
                        <p className="text-lg flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {new Date(
                                    request.submittedAt
                                ).toLocaleDateString()}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(request.submittedAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                {request.approver && (
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                            Approver
                        </Label>
                        <p className="text-lg">
                            {request.approver.firstName}{' '}
                            {request.approver.lastName}
                        </p>
                    </div>
                )}

                {request.fulfiller && (
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                            Fulfilled By
                        </Label>
                        <p className="text-lg">
                            {request.fulfiller.firstName}{' '}
                            {request.fulfiller.lastName}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
