import { api, handleApiError } from './client';
import type { 
  UserActivityReportRequest, 
  UserActivityReportResponseDto,
  UserActivityItemDto,
  UserActivitySummaryDto
} from '@/types/userActivityReport';

/**
 * User Activity Report API
 * Handles all API calls related to user activity reports
 */
export class UserActivityReportApi {
  private static readonly BASE_URL = '/api/reports/user-activity';

  /**
   * Generate user activity report for current user's department
   * @param request - Report generation parameters
   * @returns Promise<UserActivityReportResponseDto>
   */
  static async generateUserActivityReport(
    request: UserActivityReportRequest
  ): Promise<UserActivityReportResponseDto> {
    try {
      const response = await api.post<UserActivityReportResponseDto>(
        this.BASE_URL,
        request
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user activity summary for dashboard
   * @param year - Year to filter by (optional)
   * @returns Promise<UserActivityReportResponseDto>
   */
  static async getUserActivitySummary(year?: number): Promise<UserActivityReportResponseDto> {
    try {
      const params = year ? { year } : {};
      const response = await api.get<UserActivityReportResponseDto>(
        `${this.BASE_URL}/summary`,
        { params }
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user activity report for specific office
   * @param officeId - Office ID
   * @param filters - Additional filters
   * @returns Promise<UserActivityReportResponseDto>
   */
  static async getOfficeUserActivityReport(
    officeId: number,
    filters: Partial<UserActivityReportRequest> = {}
  ): Promise<UserActivityReportResponseDto> {
    try {
      const response = await api.get<UserActivityReportResponseDto>(
        `${this.BASE_URL}/office/${officeId}`,
        { params: filters }
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user activity report for department (with query parameters)
   * @param filters - Report filters
   * @returns Promise<UserActivityReportResponseDto>
   */
  static async getDepartmentUserActivityReport(
    filters: Partial<UserActivityReportRequest> = {}
  ): Promise<UserActivityReportResponseDto> {
    try {
      const response = await api.get<UserActivityReportResponseDto>(
        `${this.BASE_URL}/department`,
        { params: filters }
      );
      return response;
    } catch (error) {
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
        'Approval Rate (%)',
        'Total Value Requested',
        'Total Value Approved',
        'Last Activity'
      ].join(','),
      
      // Data rows
      ...data.map(item => [
        item.userId,
        `"${item.userName}"`,
        `"${item.userEmail}"`,
        item.userRole,
        `"${item.officeName}"`,
        `"${item.departmentName}"`,
        item.isActive ? 'Yes' : 'No',
        item.totalRequestsSubmitted,
        item.totalRequestsApproved,
        item.totalRequestsRejected,
        item.totalRequestsFulfilled,
        item.pendingRequests,
        (item.approvalRate * 100).toFixed(1),
        item.totalValueRequested.toFixed(2),
        item.totalValueApproved.toFixed(2),
        item.lastActivity ? new Date(item.lastActivity).toLocaleDateString() : 'N/A'
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `user-activity-report-${new Date().toISOString().split('T')[0]}.csv`);
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
    const activeUsers = data.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    
    const totalRequests = data.reduce((sum, user) => sum + user.totalRequestsSubmitted, 0);
    const totalApproved = data.reduce((sum, user) => sum + user.totalRequestsApproved, 0);
    const totalRejected = data.reduce((sum, user) => sum + user.totalRequestsRejected, 0);
    const totalFulfilled = data.reduce((sum, user) => sum + user.totalRequestsFulfilled, 0);
    
    const totalValueRequested = data.reduce((sum, user) => sum + user.totalValueRequested, 0);
    const totalValueApproved = data.reduce((sum, user) => sum + user.totalValueApproved, 0);
    
    const averageRequestsPerUser = totalUsers > 0 ? totalRequests / totalUsers : 0;
    const overallApprovalRate = totalRequests > 0 ? totalApproved / totalRequests : 0;
    const overallRejectionRate = totalRequests > 0 ? totalRejected / totalRequests : 0;
    const overallFulfillmentRate = totalApproved > 0 ? totalFulfilled / totalApproved : 0;
    
    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalRequests,
      totalApproved,
      totalRejected,
      totalFulfilled,
      totalValueRequested,
      totalValueApproved,
      averageRequestsPerUser,
      overallApprovalRate,
      overallRejectionRate,
      overallFulfillmentRate
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
      .filter(user => user.totalRequestsSubmitted > 0)
      .sort((a, b) => b.totalRequestsSubmitted - a.totalRequestsSubmitted)
      .slice(0, limit)
      .map(user => ({
        userId: user.userId,
        userName: user.userName,
        officeName: user.officeName,
        requestCount: user.totalRequestsSubmitted,
        totalValue: user.totalValueRequested,
        approvalRate: user.approvalRate
      }));
  }

  /**
   * Get office activity breakdown
   * @param data - Report data
   * @returns Office activity breakdown
   */
  static getOfficeActivity(data: UserActivityItemDto[]) {
    const officeMap = new Map<string, {
      officeId: number;
      officeName: string;
      userCount: number;
      requestCount: number;
      totalValue: number;
    }>();

    data.forEach(user => {
      const key = user.officeName;
      if (!officeMap.has(key)) {
        officeMap.set(key, {
          officeId: user.userId, // This would need to be actual office ID in real implementation
          officeName: user.officeName,
          userCount: 0,
          requestCount: 0,
          totalValue: 0
        });
      }
      
      const office = officeMap.get(key)!;
      office.userCount++;
      office.requestCount += user.totalRequestsSubmitted;
      office.totalValue += user.totalValueRequested;
    });

    return Array.from(officeMap.values()).map(office => ({
      ...office,
      averageRequestsPerUser: office.userCount > 0 ? office.requestCount / office.userCount : 0
    }));
  }
}

// Export individual functions for convenience
export const {
  generateUserActivityReport,
  getUserActivitySummary,
  getOfficeUserActivityReport,
  getDepartmentUserActivityReport,
  exportToCSV,
  calculateAdditionalStats,
  getTopRequesters,
  getOfficeActivity
} = UserActivityReportApi;
