package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserActivitySummaryDto {
    
    // User counts
    private Integer totalUsers;
    private Integer activeUsers;
    private Integer inactiveUsers;
    private Integer staffUsers;
    private Integer storekeeperUsers;
    
    // Request counts
    private Integer totalRequestsSubmitted;
    private Integer totalRequestsApproved;
    private Integer totalRequestsRejected;
    private Integer totalRequestsFulfilled;
    private Integer pendingRequests;
    
    // Value totals
    private BigDecimal totalValueRequested;
    private BigDecimal totalValueApproved;
    private BigDecimal totalValueRejected;
    private BigDecimal totalValueFulfilled;
    
    // Calculated metrics
    private Double averageRequestsPerUser;
    private Double overallApprovalRate;
    private Double overallRejectionRate;
    private Double overallFulfillmentRate;
    
    // Top performers
    private List<TopRequesterDto> topRequesters;
    private List<TopApproverDto> topApprovers;
    private List<OfficeActivityDto> officeActivity;
    
    // Constructor for basic summary
    public UserActivitySummaryDto(Integer totalUsers, Integer activeUsers, Integer inactiveUsers,
                                 Integer totalRequestsSubmitted, Integer totalRequestsApproved,
                                 Integer totalRequestsRejected, Integer totalRequestsFulfilled,
                                 BigDecimal totalValueRequested, BigDecimal totalValueApproved) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
        this.totalRequestsSubmitted = totalRequestsSubmitted;
        this.totalRequestsApproved = totalRequestsApproved;
        this.totalRequestsRejected = totalRequestsRejected;
        this.totalRequestsFulfilled = totalRequestsFulfilled;
        this.totalValueRequested = totalValueRequested;
        this.totalValueApproved = totalValueApproved;
        
        // Calculate derived metrics
        this.averageRequestsPerUser = totalUsers > 0 ? (double) totalRequestsSubmitted / totalUsers : 0.0;
        this.overallApprovalRate = totalRequestsSubmitted > 0 ? 
            (double) totalRequestsApproved / totalRequestsSubmitted : 0.0;
        this.overallRejectionRate = totalRequestsSubmitted > 0 ? 
            (double) totalRequestsRejected / totalRequestsSubmitted : 0.0;
        this.overallFulfillmentRate = totalRequestsApproved > 0 ? 
            (double) totalRequestsFulfilled / totalRequestsApproved : 0.0;
    }
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopRequesterDto {
        private Integer userId;
        private String userName;
        private String officeName;
        private Integer requestCount;
        private BigDecimal totalValue;
        private Double approvalRate;
    }
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopApproverDto {
        private Integer userId;
        private String userName;
        private String officeName;
        private Integer approvalCount;
        private Integer rejectionCount;
        private Double approvalRate;
    }
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OfficeActivityDto {
        private Integer officeId;
        private String officeName;
        private Integer userCount;
        private Integer requestCount;
        private BigDecimal totalValue;
        private Double averageRequestsPerUser;
    }
}
