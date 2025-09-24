import React, { useState, useEffect, memo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import {
    useUserActivityReport,
    useGenerateUserActivityReport,
    useRefreshUserActivityData,
} from '@/hooks/queries/useUserActivityReport';
import { UserActivityReportForm } from '@/components/user-activity-report/UserActivityReportForm';
import { UserActivityReportHeader } from '@/components/user-activity-report/UserActivityReportHeader';
import { UserActivityReportContent } from '@/components/user-activity-report/UserActivityReportContent';
import { UserActivityReportMetadata } from '@/components/user-activity-report/UserActivityReportMetadata';
import { exportToCSV } from '@/api/userActivityReport';
import type {
    UserActivityReportFilters,
    UserActivityReportResponseDto,
} from '@/types/userActivityReport';

function UserActivityReport(): React.JSX.Element {
    const { user, hasPermission } = useAuthStore();
    const [filters, setFilters] = useState<UserActivityReportFilters>({
        timePeriod: {
            type: 'year',
            year: new Date().getFullYear(),
        },
        includeSubmissions: true,
        includeApprovals: true,
        includeRejections: true,
        includeFulfillments: true,
        activeOnly: false,
    });
    const [reportData, setReportData] =
        useState<UserActivityReportResponseDto | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Check permissions
    const canViewReports = hasPermission('VIEW_ACTIVITY_REPORTS');
    const canExport = hasPermission('VIEW_ACTIVITY_REPORTS'); // Same permission for now

    // Convert filters to API format
    const apiFilters = {
        year:
            filters.timePeriod.type === 'year'
                ? filters.timePeriod.year
                : undefined,
        startDate:
            filters.timePeriod.type === 'dateRange'
                ? filters.timePeriod.startDate
                : undefined,
        endDate:
            filters.timePeriod.type === 'dateRange'
                ? filters.timePeriod.endDate
                : undefined,
        officeId: filters.officeId,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        includeSubmissions: filters.includeSubmissions,
        includeApprovals: filters.includeApprovals,
        includeRejections: filters.includeRejections,
        includeFulfillments: filters.includeFulfillments,
        activeOnly: filters.activeOnly,
        roleFilter: filters.roleFilter,
    };

    // Queries
    const generateReportMutation = useGenerateUserActivityReport();
    const refreshData = useRefreshUserActivityData();

    const handleGenerateReport = async (
        newFilters: UserActivityReportFilters
    ) => {
        console.log('Generating report with filters:', newFilters); // Debug log
        setFilters(newFilters);

        // Convert to API format
        const apiRequest = {
            year:
                newFilters.timePeriod.type === 'year'
                    ? newFilters.timePeriod.year
                    : undefined,
            month: newFilters.timePeriod.month,
            startDate:
                newFilters.timePeriod.type === 'dateRange'
                    ? newFilters.timePeriod.startDate
                    : undefined,
            endDate:
                newFilters.timePeriod.type === 'dateRange'
                    ? newFilters.timePeriod.endDate
                    : undefined,
            officeId: newFilters.officeId,
            userId: newFilters.userId,
            sortBy: newFilters.sortBy,
            sortOrder: newFilters.sortOrder,
            includeSubmissions: newFilters.includeSubmissions,
            includeApprovals: newFilters.includeApprovals,
            includeRejections: newFilters.includeRejections,
            includeFulfillments: newFilters.includeFulfillments,
            activeOnly: newFilters.activeOnly,
            roleFilter: newFilters.roleFilter,
        };

        try {
            console.log('API request:', apiRequest); // Debug log
            const result = await generateReportMutation.mutateAsync(apiRequest);
            console.log('API response:', result); // Debug log
            setReportData(result);
            setActiveTab('overview');
        } catch (error) {
            console.error('Failed to generate report:', error);
        }
    };

    const handleExport = () => {
        if (!reportData) return;

        try {
            exportToCSV(
                reportData.userActivities,
                reportData.summary,
                `user-activity-report-${new Date().toISOString().split('T')[0]}.csv`
            );
        } catch (error) {
            // Failed to export report
        }
    };

    const handleRefresh = () => {
        refreshData();
        // Trigger a new report generation with current filters
        if (
            filters.timePeriod.year ||
            (filters.timePeriod.startDate && filters.timePeriod.endDate)
        ) {
            handleGenerateReport(filters);
        }
    };

    if (!canViewReports) {
        return (
            <div className="container mx-auto p-6">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        You don't have permission to view user activity reports.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const isLoading = generateReportMutation.isPending;
    const error = generateReportMutation.error;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <UserActivityReportHeader
                canExport={canExport}
                hasData={!!reportData}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onExport={handleExport}
            />
            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                            <p className="text-sm text-red-800">
                                {error instanceof Error
                                    ? error.message
                                    : 'An error occurred while loading the report'}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <UserActivityReportForm
                        onGenerate={handleGenerateReport}
                        onExport={canExport ? handleExport : undefined}
                        isLoading={isLoading}
                    />
                </div>

                <div className="lg:col-span-2">
                    <UserActivityReportContent
                        reportData={reportData}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onGenerateReport={() => handleGenerateReport(filters)}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {reportData ? (
                <UserActivityReportMetadata reportData={reportData} />
            ) : null}
        </div>
    );
}

export default UserActivityReport;
