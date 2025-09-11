import { useState } from 'react';
import { useUserReportQueries } from '@/hooks/queries/useUserReport';
import UserReportFilters from '@/components/user-report/UserReportFilters';
import UserReportTable from '@/components/user-report/UserReportTable';
import type { UserReportFilters as UserReportFiltersType } from '@/types/userReport';
import UserReportHeader from '@/components/user-report/UserReportHeader';
import UserReportError from '@/components/user-report/UserReportError';

export default function UserReport() {
    const [filters, setFilters] = useState<UserReportFiltersType>({});

    const { getAllUsersReportQuery } = useUserReportQueries();

    // Get data from the API
    const { data: reportData, isLoading, error } = getAllUsersReportQuery(filters);

    const handleApplyFilters = (newFilters: UserReportFiltersType) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({});
    };

    return (
        <div className="space-y-6">
            <UserReportHeader />

            <UserReportFilters
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isLoading={isLoading}
            />

            <UserReportTable
                data={reportData?.summaries || null}
                isLoading={isLoading}
                searchTerm={filters.search}
            />

            {/* Error Display */}
            {error && (
                <UserReportError error={error} />
            )}
        </div>
    );
}