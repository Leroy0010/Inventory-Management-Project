import type { RequestStatus } from '@/types/request';
import { formatDate as formatDateUtil } from '@/utils/dateUtils';

export const formatDate = (dateString: string) => {
    return formatDateUtil(dateString, {
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
