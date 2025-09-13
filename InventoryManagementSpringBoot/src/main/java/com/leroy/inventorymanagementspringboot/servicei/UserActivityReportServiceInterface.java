package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.report.UserActivityReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserActivityReportResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;

public interface UserActivityReportServiceInterface {
    
    /**
     * Generate user activity report for a specific department
     * @param request Report request parameters
     * @param currentUser Current authenticated user (storekeeper)
     * @return User activity report response
     */
    UserActivityReportResponseDto generateUserActivityReport(UserActivityReportRequest request, User currentUser);
    
    /**
     * Generate user activity report for a specific office
     * @param request Report request parameters
     * @param officeId Office ID to filter by
     * @return User activity report response
     */
    UserActivityReportResponseDto generateOfficeUserActivityReport(UserActivityReportRequest request, Integer officeId);
    
    /**
     * Get user activity summary for dashboard
     * @param currentUser Current authenticated user
     * @param year Year to filter by (optional)
     * @return User activity summary
     */
    UserActivityReportResponseDto getUserActivitySummary(User currentUser, Integer year);
}
