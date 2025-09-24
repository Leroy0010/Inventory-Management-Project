import { api, handleApiError } from './client';
import type {
    UserActivityReportRequest,
    UserActivityReportResponseDto,
    UserActivityItemDto,
    UserActivitySummaryDto,
} from '@/types/userActivityReport';

/**
 * User Activity Report API
 * Handles all API calls related to user activity reports
 */
export class UserActivityReportApi {
    private static readonly BASE_URL = '/reports/user-activity';

    /**
     * Generate user activity report for current user's department
     * @param request - Report generation parameters
     * @returns Promise<UserActivityReportResponseDto>
     */
    static async generateUserActivityReport(
        request: UserActivityReportRequest
    ): Promise<UserActivityReportResponseDto> {
        try {
            console.log(
                'UserActivityReportApi: Starting API call with request:',
                request
            );

            const params = new URLSearchParams();
            if (request.year !== undefined && request.year !== null)
                params.append('year', request.year.toString());
            if (request.month !== undefined && request.month !== null)
                params.append('month', request.month.toString());
            if (request.startDate !== undefined && request.startDate !== null)
                params.append('startDate', request.startDate);
            if (request.endDate !== undefined && request.endDate !== null)
                params.append('endDate', request.endDate);
            if (request.officeId !== undefined && request.officeId !== null)
                params.append('officeId', request.officeId.toString());
            if (request.userId !== undefined && request.userId !== null)
                params.append('userId', request.userId.toString());
            if (request.sortBy !== undefined && request.sortBy !== null)
                params.append('sortBy', request.sortBy);
            if (request.sortOrder !== undefined && request.sortOrder !== null)
                params.append('sortOrder', request.sortOrder);
            if (request.activeOnly !== undefined)
                params.append('activeOnly', request.activeOnly.toString());

            const queryString = params.toString();
            const url = queryString
                ? `${UserActivityReportApi.BASE_URL}?${queryString}`
                : UserActivityReportApi.BASE_URL;

            console.log('UserActivityReportApi: Constructed URL:', url);
            console.log('UserActivityReportApi: Query params:', queryString);

            console.log(
                'UserActivityReportApi: About to make API call to:',
                url
            );
            console.log('UserActivityReportApi: api object:', api);
            console.log('UserActivityReportApi: api.get method:', api.get);
            const response = await api.get(url);
            console.log(
                'UserActivityReportApi: API response received:',
                response
            );
            return response as UserActivityReportResponseDto;
        } catch (error) {
            console.error('UserActivityReportApi: Error caught:', error);
            console.error('UserActivityReportApi: Error type:', typeof error);
            console.error(
                'UserActivityReportApi: Error constructor:',
                error?.constructor?.name
            );
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Export user activity report to CSV format
     * @param data - Report data to export
     * @param summary - Summary data to include
     * @param filename - Optional filename
     */
    static exportToCSV(
        data: UserActivityItemDto[],
        summary?: UserActivitySummaryDto,
        filename?: string
    ): void {
        if (data.length === 0) {
            throw new Error('No data to export');
        }

        // Create CSV content
        const csvContent = [
            // Headers
            [
                'User ID',
                'User Name',
                'Email',
                'Role',
                'Office',
                'Department',
                'Active',
                'Total Requests',
                'Approved',
                'Rejected',
                'Fulfilled',
                'Pending',
                'Items Requested',
                'Items Approved',
                'Items Rejected',
                'Items Fulfilled',
                'Approval Rate (%)',
                'Last Activity',
            ].join(','),

            // Data rows
            ...data.map((item) =>
                [
                    item.userId,
                    `"${item.fullName}"`,
                    `"${item.email}"`,
                    item.userRole,
                    `"${item.officeName}"`,
                    `"${item.departmentName}"`,
                    item.isActive ? 'Yes' : 'No',
                    item.totalRequestsSubmitted,
                    item.totalRequestsApproved,
                    item.totalRequestsRejected,
                    item.totalRequestsFulfilled,
                    item.pendingRequests,
                    item.totalItemsRequested,
                    item.totalItemsApproved,
                    item.totalItemsRejected,
                    item.totalItemsFulfilled,
                    (item.approvalRate * 100).toFixed(1),
                    item.lastActivity
                        ? new Date(item.lastActivity).toLocaleDateString()
                        : 'N/A',
                ].join(',')
            ),
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            filename ||
                `user-activity-report-${new Date().toISOString().split('T')[0]}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Calculate additional statistics from report data
     * @param data - Report data
     * @returns Additional calculated statistics
     */
    static calculateAdditionalStats(data: UserActivityItemDto[]) {
        const totalUsers = data.length;
        const activeUsers = data.filter((user) => user.isActive).length;
        const inactiveUsers = totalUsers - activeUsers;

        const totalRequests = data.reduce(
            (sum, user) => sum + user.totalRequestsSubmitted,
            0
        );
        const totalApproved = data.reduce(
            (sum, user) => sum + user.totalRequestsApproved,
            0
        );
        const totalRejected = data.reduce(
            (sum, user) => sum + user.totalRequestsRejected,
            0
        );
        const totalFulfilled = data.reduce(
            (sum, user) => sum + user.totalRequestsFulfilled,
            0
        );

        const totalItemsRequested = data.reduce(
            (sum, user) => sum + user.totalItemsRequested,
            0
        );
        const totalItemsApproved = data.reduce(
            (sum, user) => sum + user.totalItemsApproved,
            0
        );

        const averageRequestsPerUser =
            totalUsers > 0 ? totalRequests / totalUsers : 0;
        const overallApprovalRate =
            totalRequests > 0 ? totalApproved / totalRequests : 0;
        const overallRejectionRate =
            totalRequests > 0 ? totalRejected / totalRequests : 0;
        const overallFulfillmentRate =
            totalApproved > 0 ? totalFulfilled / totalApproved : 0;

        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalRequests,
            totalApproved,
            totalRejected,
            totalFulfilled,
            totalItemsRequested,
            totalItemsApproved,
            averageRequestsPerUser,
            overallApprovalRate,
            overallRejectionRate,
            overallFulfillmentRate,
        };
    }

    /**
     * Get top requesters from data
     * @param data - Report data
     * @param limit - Number of top requesters to return
     * @returns Top requesters
     */
    static getTopRequesters(data: UserActivityItemDto[], limit: number = 5) {
        return data
            .filter((user) => user.totalRequestsSubmitted > 0)
            .sort((a, b) => b.totalRequestsSubmitted - a.totalRequestsSubmitted)
            .slice(0, limit)
            .map((user) => ({
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                officeName: user.officeName,
                requestCount: user.totalRequestsSubmitted,
                itemCount: user.totalItemsRequested,
                approvalRate: user.approvalRate,
                fulfillmentRate: user.fulfillmentRate,
            }));
    }

    /**
     * Get office activity breakdown
     * @param data - Report data
     * @returns Office activity breakdown
     */
    static getOfficeActivity(data: UserActivityItemDto[]) {
        const officeMap = new Map<
            string,
            {
                officeId: number;
                officeName: string;
                userCount: number;
                requestCount: number;
                itemCount: number;
            }
        >();

        data.forEach((user) => {
            const key = user.officeName;
            if (!officeMap.has(key)) {
                officeMap.set(key, {
                    officeId: user.userId, // This would need to be actual office ID in real implementation
                    officeName: user.officeName,
                    userCount: 0,
                    requestCount: 0,
                    itemCount: 0,
                });
            }

            const office = officeMap.get(key)!;
            office.userCount++;
            office.requestCount += user.totalRequestsSubmitted;
            office.itemCount += user.totalItemsRequested;
        });

        return Array.from(officeMap.values()).map((office) => ({
            ...office,
            averageRequestsPerUser:
                office.userCount > 0
                    ? office.requestCount / office.userCount
                    : 0,
        }));
    }
}

// Export individual functions for convenience
export const {
    generateUserActivityReport,
    exportToCSV,
    calculateAdditionalStats,
    getTopRequesters,
    getOfficeActivity,
} = UserActivityReportApi;
