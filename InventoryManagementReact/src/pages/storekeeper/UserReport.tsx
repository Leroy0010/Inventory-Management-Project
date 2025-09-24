import { useState } from 'react';
import { useUserReportQueries } from '@/hooks/queries/useUserReport';
import UserReportFilters from '@/components/user-report/UserReportFilters';
import SingleUserReportTable from '@/components/user-report/UserReportTable';
import type { UserReportFilters as UserReportFiltersType } from '@/types/userReport';
import UserReportHeader from '@/components/user-report/UserReportHeader';
import UserReportError from '@/components/user-report/UserReportError';

export default function UserReport() {
    const [filters, setFilters] = useState<UserReportFiltersType>({});

    const { getUserReportQuery } = useUserReportQueries();

    // Get data from the API - only when we have a userId and either year or date range
    const shouldFetch =
        filters.userId &&
        (filters.year || (filters.startDate && filters.endDate));
    const {
        data: reportData,
        isLoading,
        error,
    } = getUserReportQuery(shouldFetch ? filters : null);

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

            {shouldFetch ? (
                <SingleUserReportTable
                    data={reportData || null}
                    isLoading={isLoading}
                />
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        Please select a user and either a year or date range to
                        generate the report
                    </p>
                </div>
            )}

            {/* Error Display */}
            {error && <UserReportError error={error} />}
        </div>
    );
}
