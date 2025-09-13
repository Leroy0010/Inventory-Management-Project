package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Getter
@Setter
public class UserActivityReportRequest {
    
    // Time period options
    private Integer year;                    // Optional - for single year reports
    private LocalDate startDate;             // Optional - for custom date range
    private LocalDate endDate;               // Optional - for custom date range
    
    // Filtering options
    private Integer officeId;                // Optional - filter by specific office
    private String search;                   // Optional - search by user name or email
    private String sortBy;                   // Optional - sort field (name, requests, lastActivity, etc.)
    private String sortOrder;                // Optional - sort direction (ASC, DESC)
    
    // Activity type filters
    private Boolean includeSubmissions;      // Optional - include request submissions
    private Boolean includeApprovals;        // Optional - include request approvals
    private Boolean includeRejections;       // Optional - include request rejections
    private Boolean includeFulfillments;     // Optional - include request fulfillments
    
    // User status filters
    private Boolean activeOnly;              // Optional - show only active users
    private String roleFilter;               // Optional - filter by role (STAFF, STOREKEEPER, etc.)
    
    public UserActivityReportRequest() {
        // Default values
        this.includeSubmissions = true;
        this.includeApprovals = true;
        this.includeRejections = true;
        this.includeFulfillments = true;
        this.activeOnly = false;
    }
    
    // Validation method
    public boolean isValid() {
        // Must have either year or date range
        boolean hasYear = year != null && year > 0;
        boolean hasDateRange = startDate != null && endDate != null && !startDate.isAfter(endDate);
        
        return hasYear || hasDateRange;
    }
}
