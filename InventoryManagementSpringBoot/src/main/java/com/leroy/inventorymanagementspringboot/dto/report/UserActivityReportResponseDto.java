package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserActivityReportResponseDto {
    
    // Report metadata
    private String reportType;
    private String generatedAt;
    private String generatedBy;
    private String departmentName;
    private String timePeriod;
    
    // Summary statistics
    private UserActivitySummaryDto summary;
    
    // Detailed user activities
    private List<UserActivityItemDto> userActivities;
    
    // Filtering information
    private UserActivityReportRequest filters;
    
    // Pagination info (if needed)
    private Integer totalPages;
    private Integer currentPage;
    private Long totalRecords;
    
    public UserActivityReportResponseDto(UserActivitySummaryDto summary, 
                                       List<UserActivityItemDto> userActivities,
                                       UserActivityReportRequest filters) {
        this.summary = summary;
        this.userActivities = userActivities;
        this.filters = filters;
        this.reportType = "USER_ACTIVITY_REPORT";
    }
}
