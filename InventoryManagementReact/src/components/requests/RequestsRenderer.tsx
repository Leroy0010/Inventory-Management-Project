import Unauthorized from '@/pages/Unauthorized';
import type { Role } from '@/types/auth';
import { lazy, Suspense } from 'react';
import { RequestsLoading } from './RequestsLoading';

const StorekeeperRequests = lazy(
    () => import('@/pages/storekeeper/ManageRequests')
);

const StaffRequests = lazy(() => import('@/pages/staff/MyRequests'));

interface RequestsRenderProps {
    userRole: Role;
}

export function RequestsRenderer({ userRole }: RequestsRenderProps) {
    const renderRequests = () => {
        if (userRole === 'STOREKEEPER') return <StorekeeperRequests />;
        if (userRole === 'STAFF') return <StaffRequests />;
        return <Unauthorized />;
    };
    return (
        <Suspense fallback={<RequestsLoading />}>{renderRequests()}</Suspense>
    );
}
