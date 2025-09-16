import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Download,
    RefreshCw,
    AlertCircle,
    FileText,
    BarChart3,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import {
    useDepartmentUserActivityReport,
    useGenerateUserActivityReport,
    useRefreshUserActivityData,
} from '@/hooks/queries/useUserActivityReport';
import { UserActivityReportForm } from '@/components/user-activity-report/UserActivityReportForm';
import { UserActivityReportTable } from '@/components/user-activity-report/UserActivityReportTable';
import { UserActivitySummary } from '@/components/user-activity-report/UserActivitySummary';
import { exportToCSV } from '@/api/userActivityReport';
import { cn } from '@/lib/utils';
import type {
    UserActivityReportFilters,
    UserActivityReportResponseDto,
} from '@/types/userActivityReport';


export default function UserActivityReport() {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        User Activity Report
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor user activity, performance metrics, and request
                        patterns
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw
                            className={cn(
                                'h-4 w-4',
                                isLoading && 'animate-spin'
                            )}
                        />
                        Refresh
                    </Button>
                    {canExport && reportData && (
                        <Button
                            onClick={handleExport}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    )}
                </div>
            </div>

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
                    {reportData ? (
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="overview"
                                    className="flex items-center gap-2"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="details"
                                    className="flex items-center gap-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    Details
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                                <UserActivitySummary
                                    summary={reportData.summary}
                                />
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4">
                                <UserActivityReportTable
                                    data={reportData.userActivities}
                                    isLoading={isLoading}
                                />
                            </TabsContent>
                        </Tabs>
                    ) : (
                    <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Report Data
                                </h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Configure your filters and generate a report
                                    to view user activity data.
                                </p>
                                <Button
                                    onClick={() =>
                                        handleGenerateReport(filters)
                                    }
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? 'Generating...'
                                        : 'Generate Report'}
                                </Button>
                        </CardContent>
                    </Card>
                    )}
                </div>
            </div>

            {/* Report Metadata */}
            {reportData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">
                            Report Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <span className="font-medium">Generated:</span>{' '}
                                {new Date(
                                    reportData.generatedAt
                                ).toLocaleString()}
                                        </div>
                                        <div>
                                <span className="font-medium">
                                    Generated By:
                                </span>{' '}
                                {reportData.generatedBy}
                                        </div>
                            <div>
                                <span className="font-medium">Department:</span>{' '}
                                {reportData.departmentName}
                                    </div>
                            <div>
                                <span className="font-medium">Period:</span>{' '}
                                {reportData.timePeriod}
                                </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
