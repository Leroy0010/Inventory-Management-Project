import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, Package, XCircle } from 'lucide-react';
import type { RequestResponseDto, RequestStatus } from '@/types/request';

interface RequestDetailsHeaderProps {
    request: RequestResponseDto;
    onBack?: () => void;
}

export function RequestDetailsHeader({
    request,
    onBack,
}: RequestDetailsHeaderProps) {
    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'FULFILLED':
                return 'bg-blue-100 text-blue-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: RequestStatus) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="h-3 w-3" />;
            case 'APPROVED':
                return <CheckCircle className="h-3 w-3" />;
            case 'FULFILLED':
                return <Package className="h-3 w-3" />;
            case 'REJECTED':
                return <XCircle className="h-3 w-3" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Requests
            </Button>
            <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight">
                    Request #{request.id}
                </h1>
                <p className="text-muted-foreground">
                    Submitted on{' '}
                    {new Date(request.submittedAt).toLocaleDateString()}
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(request.status)}>
                    <div className="flex items-center space-x-1">
                        {getStatusIcon(request.status)}
                        <span>{request.status}</span>
                    </div>
                </Badge>
            </div>
        </div>
    );
}
