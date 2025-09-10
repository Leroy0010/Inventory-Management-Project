import type { RequestStatus } from "@/types/request";

export const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };


export const getStatusBadgeVariant = (status: RequestStatus) => {
    switch (status) {
        case 'PENDING':
            return 'secondary';
        case 'APPROVED':
            return 'default';
        case 'FULFILLED':
            return 'default';
        case 'REJECTED':
            return 'destructive';
        default:
            return 'secondary';
    }
};


