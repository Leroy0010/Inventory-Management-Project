import { useState, useEffect, memo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import {
    useDepartmentUserActivityReport,
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


const UserActivityReport = memo(function UserActivityReport() {
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
        search: filters.search,
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
    const {
        data: departmentData,
        isLoading: isDepartmentLoading,
        error: departmentError,
        refetch: refetchDepartment,
    } = useDepartmentUserActivityReport(apiFilters, canViewReports);

    const generateReportMutation = useGenerateUserActivityReport();
    const refreshData = useRefreshUserActivityData();

    // Update report data when department data changes
    useEffect(() => {
        if (departmentData) {
            setReportData(departmentData);
        }
    }, [departmentData]);

    const handleGenerateReport = async (
        newFilters: UserActivityReportFilters
    ) => {
        setFilters(newFilters);

        // Convert to API format
        const apiRequest = {
            year:
                newFilters.timePeriod.type === 'year'
                    ? newFilters.timePeriod.year
                    : undefined,
            startDate:
                newFilters.timePeriod.type === 'dateRange'
                    ? newFilters.timePeriod.startDate
                    : undefined,
            endDate:
                newFilters.timePeriod.type === 'dateRange'
                    ? newFilters.timePeriod.endDate
                    : undefined,
            officeId: newFilters.officeId,
            search: newFilters.search,
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
            const result = await generateReportMutation.mutateAsync(apiRequest);
            setReportData(result);
            setActiveTab('overview');
        } catch (error) {
            // Failed to generate report
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
        refetchDepartment();
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

    const isLoading = isDepartmentLoading || generateReportMutation.isPending;
    const error = departmentError || generateReportMutation.error;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <UserActivityReportHeader
                onRefresh={handleRefresh}
                onExport={canExport ? handleExport : undefined}
                isLoading={isLoading}
                canExport={canExport}
                hasData={!!reportData}
            />

            {/* Error Display */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error instanceof Error
                            ? error.message
                            : 'An error occurred while loading the report'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Filters */}
                <div className="lg:col-span-1">
                    <UserActivityReportForm
                        onGenerate={handleGenerateReport}
                        onExport={canExport ? handleExport : undefined}
                        isLoading={isLoading}
                    />
                </div>

                {/* Report Content */}
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

            {/* Report Metadata */}
            {reportData && (
                <UserActivityReportMetadata reportData={reportData} />
            )}
        </div>
    );
});

export default UserActivityReport;
