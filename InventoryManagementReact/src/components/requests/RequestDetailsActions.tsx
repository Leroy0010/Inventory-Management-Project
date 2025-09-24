import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Package, ExternalLink } from 'lucide-react';
import type { RequestResponseDto } from '@/types/request';

interface RequestDetailsActionsProps {
    request: RequestResponseDto;
    userRole: 'STAFF' | 'STOREKEEPER' | 'ADMIN';
    isUpdating: boolean;
    onApprove?: (request: RequestResponseDto) => void;
    onReject?: (request: RequestResponseDto) => void;
    onFulfill?: (request: RequestResponseDto) => void;
    onViewFullScreen: () => void;
    onClose: () => void;
}

export function RequestDetailsActions({
    request,
    userRole,
    isUpdating,
    onApprove,
    onReject,
    onFulfill,
    onViewFullScreen,
    onClose,
}: RequestDetailsActionsProps) {
    const getActionButtons = () => {
        const buttons = [];

        if (userRole === 'STOREKEEPER' && request.status === 'PENDING') {
            if (onApprove) {
                buttons.push(
                    <Button
                        key="approve"
                        onClick={() => onApprove(request)}
                        disabled={isUpdating}
                        aria-label={`Approve request ${request.id}`}
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                    </Button>
                );
            }
            if (onReject) {
                buttons.push(
                    <Button
                        key="reject"
                        variant="destructive"
                        onClick={() => onReject(request)}
                        disabled={isUpdating}
                        aria-label={`Reject request ${request.id}`}
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                    </Button>
                );
            }
        }

        if (
            userRole === 'STAFF' &&
            request.status === 'APPROVED' &&
            onFulfill
        ) {
            buttons.push(
                <Button
                    key="fulfill"
                    onClick={() => onFulfill(request)}
                    disabled={isUpdating}
                    aria-label={`Fulfill request ${request.id}`}
                >
                    <Package className="h-4 w-4 mr-2" />
                    Fulfill
                </Button>
            );
        }

        return buttons;
    };

    return (
        <div className="flex items-center justify-between w-full">
            {/* Full Screen Button */}
            <Button
                variant="outline"
                onClick={onViewFullScreen}
                className="flex items-center space-x-2 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
            >
                <ExternalLink className="h-4 w-4" />
                <span>View Full Screen</span>
            </Button>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
                {getActionButtons()}
            </div>
        </div>
    );
}
