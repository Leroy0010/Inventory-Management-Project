package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserActivityItemDto {

    // User information
    private Integer userId;
    private String fullName;
    private String email;
    private String userRole;
    private String officeName;
    private String departmentName;
    private Boolean isActive;

    // Request activity metrics
    private Integer totalRequestsSubmitted;
    private Integer totalRequestsApproved;
    private Integer totalRequestsRejected;
    private Integer totalRequestsFulfilled;
    private Integer pendingRequests;

    // Removed value metrics - using quantities only

    // Activity timestamps
    private LocalDateTime lastRequestSubmitted;
    private LocalDateTime lastRequestApproved;
    private LocalDateTime lastRequestRejected;
    private LocalDateTime lastRequestFulfilled;
    private LocalDateTime lastActivity;

    // Calculated metrics
    private Double approvalRate;
    private Double rejectionRate;
    private Double fulfillmentRate;
    private Integer totalItemsRequested;
    private Integer totalItemsApproved;
    private Integer totalItemsRejected;
    private Integer totalItemsFulfilled;

    // Constructor for repository query results
    public UserActivityItemDto(Integer userId, String fullName, String email,
            String userRole, String officeName, String departmentName,
            Boolean isActive, Long totalRequestsSubmitted,
            Long totalRequestsApproved, Long totalRequestsRejected,
            Long totalRequestsFulfilled, Long pendingRequests,
            LocalDateTime lastActivity) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.userRole = userRole;
        this.officeName = officeName;
        this.departmentName = departmentName;
        this.isActive = isActive;
        this.totalRequestsSubmitted = totalRequestsSubmitted != null ? totalRequestsSubmitted.intValue() : 0;
        this.totalRequestsApproved = totalRequestsApproved != null ? totalRequestsApproved.intValue() : 0;
        this.totalRequestsRejected = totalRequestsRejected != null ? totalRequestsRejected.intValue() : 0;
        this.totalRequestsFulfilled = totalRequestsFulfilled != null ? totalRequestsFulfilled.intValue() : 0;
        this.pendingRequests = pendingRequests != null ? pendingRequests.intValue() : 0;
        this.lastActivity = lastActivity;

        // Calculate rates
        this.approvalRate = calculateRate(totalRequestsApproved, totalRequestsSubmitted);
        this.rejectionRate = calculateRate(totalRequestsRejected, totalRequestsSubmitted);
        this.fulfillmentRate = calculateRate(totalRequestsFulfilled, totalRequestsApproved);
    }

    private Double calculateRate(Long numerator, Long denominator) {
        if (denominator == null || denominator == 0)
            return 0.0;
        return Math.round((numerator.doubleValue() / denominator.doubleValue()) * 100.0) / 100.0;
    }
}
