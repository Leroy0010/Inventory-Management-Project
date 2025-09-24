package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Getter
@Setter
public class UserActivityReportRequest {

    // Time period options
    private Integer year; // Optional - for single year reports
    private Integer month; // Optional - for specific month (1-12)
    private LocalDate startDate; // Optional - for custom date range
    private LocalDate endDate; // Optional - for custom date range

    // Filtering options
    private Integer officeId; // Optional - filter by specific office
    private Integer userId; // Optional - filter by specific user (staff/storekeeper)
    private String sortBy; // Optional - sort field (name, requests, lastActivity, etc.)
    private String sortOrder; // Optional - sort direction (ASC, DESC)

    // User status filters
    private Boolean activeOnly; // Optional - show only active users

    public UserActivityReportRequest() {
        // Default values
        this.activeOnly = false;
    }

    // Validation method
    public boolean isValid() {
        // Must have either year (with optional month) or date range
        boolean hasYear = year != null && year > 0;
        boolean hasMonth = month != null && month >= 1 && month <= 12;
        boolean hasDateRange = startDate != null && endDate != null && !startDate.isAfter(endDate);

        // If month is provided, year must also be provided
        if (hasMonth && !hasYear) {
            return false;
        }

        return hasYear || hasDateRange;
    }
}
