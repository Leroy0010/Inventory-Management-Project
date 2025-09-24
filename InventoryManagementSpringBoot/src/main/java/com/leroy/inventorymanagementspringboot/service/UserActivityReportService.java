package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.dto.report.*;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.*;
import com.leroy.inventorymanagementspringboot.servicei.UserActivityReportServiceInterface;
import lombok.Data;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional(readOnly = true)
public class UserActivityReportService implements UserActivityReportServiceInterface {

    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final RequestItemRepository requestItemRepository;
    private final OfficeRepository officeRepository;
    private final DepartmentRepository departmentRepository;

    public UserActivityReportService(UserRepository userRepository,
            RequestRepository requestRepository,
            RequestItemRepository requestItemRepository,
            OfficeRepository officeRepository,
            DepartmentRepository departmentRepository) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
        this.requestItemRepository = requestItemRepository;
        this.officeRepository = officeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public UserActivityReportResponseDto generateUserActivityReport(UserActivityReportRequest request,
            User currentUser) {
        // Get current user's department
        Integer departmentId = currentUser.getDepartment().getId();

        // Generate report for the department
        return generateDepartmentUserActivityReport(request, departmentId, currentUser);
    }

    @Override
    public UserActivityReportResponseDto generateOfficeUserActivityReport(UserActivityReportRequest request,
            Integer officeId) {
        // Get office to find department
        var office = officeRepository.findById(officeId)
                .orElseThrow(() -> new IllegalArgumentException("Office not found"));

        // Generate report for the specific office
        return generateDepartmentUserActivityReport(request, office.getDepartment().getId(), null, officeId);
    }

    @Override
    public UserActivityReportResponseDto getUserActivitySummary(User currentUser, Integer year) {
        UserActivityReportRequest request = new UserActivityReportRequest();
        request.setYear(year != null ? year : LocalDate.now().getYear());

        return generateUserActivityReport(request, currentUser);
    }

    private UserActivityReportResponseDto generateDepartmentUserActivityReport(UserActivityReportRequest request,
            Integer departmentId,
            User currentUser) {
        return generateDepartmentUserActivityReport(request, departmentId, currentUser, null);
    }

    private UserActivityReportResponseDto generateDepartmentUserActivityReport(UserActivityReportRequest request,
            Integer departmentId,
            User currentUser,
            Integer officeId) {
        // Validate request
        if (!request.isValid()) {
            throw new IllegalArgumentException("Invalid request parameters. Must provide either year or date range.");
        }

        // Get department name
        String departmentName = departmentRepository.findById(departmentId)
                .map(Department::getName)
                .orElse("Unknown Department");

        // Get user activities for the department
        List<UserActivityItemDto> userActivities = getUserActivitiesForDepartment(
                departmentId, request, officeId, currentUser);

        // Generate summary statistics
        UserActivitySummaryDto summary = generateSummaryStatistics(userActivities);

        // Create response
        UserActivityReportResponseDto response = new UserActivityReportResponseDto(
                summary, userActivities, request);

        // Set metadata
        response.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.setGeneratedBy(currentUser != null ? currentUser.getFullName() : "System");
        response.setDepartmentName(departmentName);
        response.setTimePeriod(generateTimePeriodDescription(request));

        return response;
    }

    private List<UserActivityItemDto> getUserActivitiesForDepartment(Integer departmentId,
            UserActivityReportRequest request,
            Integer officeId,
            User currentUser) {
        // Get users based on the relationship: staff.getOffice().getDepartment() ==
        // storekeeper.getDepartment()
        // This includes staff users whose office belongs to the storekeeper's
        // department
        List<User> users = userRepository.findUsersByOfficeDepartment(departmentId);

        // Exclude the current user (storekeeper) who is generating the report
        if (currentUser != null) {
            users = users.stream()
                    .filter(user -> !user.getId().equals(currentUser.getId()))
                    .collect(Collectors.toList());
        }

        // Filter by office if specified
        if (officeId != null) {
            users = users.stream()
                    .filter(user -> user.getOffice() != null && user.getOffice().getId() == officeId)
                    .collect(Collectors.toList());
        }

        // Apply additional filters
        if (request.getUserId() != null) {
            users = users.stream()
                    .filter(user -> user.getId().equals(request.getUserId()))
                    .collect(Collectors.toList());
        }

        if (request.getActiveOnly() != null && request.getActiveOnly()) {
            users = users.stream()
                    .filter(User::isActive)
                    .collect(Collectors.toList());
        }

        if (request.getRoleFilter() != null && !request.getRoleFilter().trim().isEmpty()) {
            users = users.stream()
                    .filter(user -> user.getRole() != null &&
                            user.getRole().getName().equals(request.getRoleFilter()))
                    .collect(Collectors.toList());
        }

        // Convert to DTOs
        return users.stream()
                .map(user -> buildUserActivityItem(user, request))
                .collect(Collectors.toList());
    }

    private UserActivityItemDto buildUserActivityItem(User user, UserActivityReportRequest request) {
        // Get request statistics for the user
        var requestStats = getRequestStatisticsForUser(user.getId(), request);

        // Build DTO
        UserActivityItemDto dto = new UserActivityItemDto();
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setUserRole(user.getRole() != null ? user.getRole().getName() : "UNKNOWN");
        dto.setOfficeName(user.getOffice() != null ? user.getOffice().getName() : "No Office");
        // Get department name from office if user doesn't have direct department
        // assignment
        String departmentName = "No Department";
        if (user.getDepartment() != null) {
            departmentName = user.getDepartment().getName();
        } else if (user.getOffice() != null && user.getOffice().getDepartment() != null) {
            departmentName = user.getOffice().getDepartment().getName();
        }
        dto.setDepartmentName(departmentName);
        dto.setIsActive(user.isActive());

        // Set request statistics (int fields are never null)
        dto.setTotalRequestsSubmitted(requestStats.getTotalSubmitted());
        dto.setTotalRequestsApproved(requestStats.getTotalApproved());
        dto.setTotalRequestsRejected(requestStats.getTotalRejected());
        dto.setTotalRequestsFulfilled(requestStats.getTotalFulfilled());

        // Calculate pending requests: submitted - approved - rejected
        int submitted = requestStats.getTotalSubmitted();
        int approved = requestStats.getTotalApproved();
        int rejected = requestStats.getTotalRejected();
        dto.setPendingRequests(Math.max(0, submitted - approved - rejected));

        // Removed value statistics - using quantities only

        // Set timestamps
        dto.setLastRequestSubmitted(requestStats.getLastSubmitted());
        dto.setLastRequestApproved(requestStats.getLastApproved());
        dto.setLastRequestRejected(requestStats.getLastRejected());
        dto.setLastRequestFulfilled(requestStats.getLastFulfilled());
        dto.setLastActivity(requestStats.getLastActivity());

        // Set item counts (int fields are never null)
        dto.setTotalItemsRequested(requestStats.getTotalItemsRequested());
        dto.setTotalItemsApproved(requestStats.getTotalItemsApproved());
        dto.setTotalItemsRejected(requestStats.getTotalItemsRejected());
        dto.setTotalItemsFulfilled(requestStats.getTotalItemsFulfilled());

        // Calculate rates
        int fulfilled = requestStats.getTotalFulfilled();

        dto.setApprovalRate(submitted > 0 ? (double) approved / submitted : 0.0);
        dto.setRejectionRate(submitted > 0 ? (double) rejected / submitted : 0.0);
        dto.setFulfillmentRate(approved > 0 ? (double) fulfilled / approved : 0.0);

        return dto;
    }

    private RequestStatistics getRequestStatisticsForUser(Integer userId, UserActivityReportRequest request) {
        RequestStatistics stats = new RequestStatistics();

        // Get date range for filtering
        LocalDate startDate = getStartDate(request);
        LocalDate endDate = getEndDate(request);

        // Validate dates
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Invalid date range: startDate=" + startDate + ", endDate=" + endDate);
        }

        try {
            // Get request counts by status
            var requestCounts = requestRepository.getRequestCountsByUserAndDateRange(userId,
                    java.sql.Timestamp.valueOf(startDate.atStartOfDay()),
                    java.sql.Timestamp.valueOf(endDate.atTime(23, 59, 59)));
            for (Object[] result : requestCounts) {
                String status = (String) result[0];
                Long count = (Long) result[1];
                switch (status) {
                    case "SUBMITTED" -> stats.setTotalSubmitted(count.intValue());
                    case "APPROVED" -> stats.setTotalApproved(count.intValue());
                    case "REJECTED" -> stats.setTotalRejected(count.intValue());
                    case "FULFILLED" -> stats.setTotalFulfilled(count.intValue());
                    case "PENDING" -> stats.setPending(count.intValue());
                }
            }

            // Removed value totals - using quantities only

            // Get item counts
            var itemCounts = requestItemRepository.getItemCountsByUserAndDateRange(userId,
                    java.sql.Timestamp.valueOf(startDate.atStartOfDay()),
                    java.sql.Timestamp.valueOf(endDate.atTime(23, 59, 59)));
            for (Object[] result : itemCounts) {
                String status = (String) result[0];
                Long count = (Long) result[1];
                switch (status) {
                    case "SUBMITTED" -> stats.setTotalItemsRequested(count.intValue());
                    case "APPROVED" -> stats.setTotalItemsApproved(count.intValue());
                    case "REJECTED" -> stats.setTotalItemsRejected(count.intValue());
                    case "FULFILLED" -> stats.setTotalItemsFulfilled(count.intValue());
                }
            }

            // Get last activity timestamps
            var lastActivities = requestRepository.getLastActivityTimestampsByUser(userId,
                    java.sql.Timestamp.valueOf(startDate.atStartOfDay()),
                    java.sql.Timestamp.valueOf(endDate.atTime(23, 59, 59)));
            for (Object[] result : lastActivities) {
                String status = (String) result[0];
                java.sql.Timestamp timestamp = (java.sql.Timestamp) result[1];
                LocalDateTime localDateTime = timestamp.toLocalDateTime();
                switch (status) {
                    case "SUBMITTED" -> stats.setLastSubmitted(localDateTime);
                    case "APPROVED" -> stats.setLastApproved(localDateTime);
                    case "REJECTED" -> stats.setLastRejected(localDateTime);
                    case "FULFILLED" -> stats.setLastFulfilled(localDateTime);
                }
            }

            // Calculate last activity (most recent)
            LocalDateTime lastActivity = Stream.of(
                    stats.getLastSubmitted(),
                    stats.getLastApproved(),
                    stats.getLastRejected(),
                    stats.getLastFulfilled())
                    .filter(java.util.Objects::nonNull)
                    .max(LocalDateTime::compareTo)
                    .orElse(null);
            stats.setLastActivity(lastActivity);

            return stats;
        } catch (Exception e) {
            throw new RuntimeException("Error getting request statistics for user " + userId + ": " + e.getMessage(),
                    e);
        }
    }

    private LocalDate getStartDate(UserActivityReportRequest request) {
        if (request.getStartDate() != null) {
            return request.getStartDate();
        } else if (request.getYear() != null) {
            if (request.getMonth() != null) {
                return LocalDate.of(request.getYear(), request.getMonth(), 1);
            } else {
                return LocalDate.of(request.getYear(), 1, 1);
            }
        } else {
            return LocalDate.now().minusYears(1); // Default to last year
        }
    }

    private LocalDate getEndDate(UserActivityReportRequest request) {
        if (request.getEndDate() != null) {
            return request.getEndDate();
        } else if (request.getYear() != null) {
            if (request.getMonth() != null) {
                return LocalDate.of(request.getYear(), request.getMonth(),
                        LocalDate.of(request.getYear(), request.getMonth(), 1).lengthOfMonth());
            } else {
                return LocalDate.of(request.getYear(), 12, 31);
            }
        } else {
            return LocalDate.now(); // Default to now
        }
    }

    private UserActivitySummaryDto generateSummaryStatistics(List<UserActivityItemDto> userActivities) {
        // Calculate summary statistics
        int totalUsers = userActivities.size();
        int activeUsers = (int) userActivities.stream().filter(UserActivityItemDto::getIsActive).count();
        int inactiveUsers = totalUsers - activeUsers;
        int staffUsers = (int) userActivities.stream()
                .filter(user -> "STAFF".equals(user.getUserRole()))
                .count();

        int totalRequestsSubmitted = userActivities.stream()
                .mapToInt(UserActivityItemDto::getTotalRequestsSubmitted)
                .sum();
        int totalRequestsApproved = userActivities.stream()
                .mapToInt(UserActivityItemDto::getTotalRequestsApproved)
                .sum();
        int totalRequestsRejected = userActivities.stream()
                .mapToInt(UserActivityItemDto::getTotalRequestsRejected)
                .sum();
        int totalRequestsFulfilled = userActivities.stream()
                .mapToInt(UserActivityItemDto::getTotalRequestsFulfilled)
                .sum();

        // Calculate item totals
        int totalItemsRequested = userActivities.stream()
                .mapToInt(UserActivityItemDto::getTotalItemsRequested)
                .sum();
        int totalItemsApproved = userActivities.stream()
                .mapToInt(UserActivityItemDto::getTotalItemsApproved)
                .sum();
        int totalItemsRejected = userActivities.stream()
                .mapToInt(UserActivityItemDto::getTotalItemsRejected)
                .sum();
        int totalItemsFulfilled = userActivities.stream()
                .mapToInt(UserActivityItemDto::getTotalItemsFulfilled)
                .sum();

        // Calculate pending requests
        int pendingRequests = Math.max(0, totalRequestsSubmitted - totalRequestsApproved - totalRequestsRejected);

        // Create summary DTO
        UserActivitySummaryDto summary = new UserActivitySummaryDto();
        summary.setTotalUsers(totalUsers);
        summary.setActiveUsers(activeUsers);
        summary.setInactiveUsers(inactiveUsers);
        summary.setStaffUsers(staffUsers);
        summary.setTotalRequestsSubmitted(totalRequestsSubmitted);
        summary.setTotalRequestsApproved(totalRequestsApproved);
        summary.setTotalRequestsRejected(totalRequestsRejected);
        summary.setTotalRequestsFulfilled(totalRequestsFulfilled);
        summary.setPendingRequests(pendingRequests);

        // Calculate derived metrics
        summary.setAverageRequestsPerUser(totalUsers > 0 ? (double) totalRequestsSubmitted / totalUsers : 0.0);
        summary.setOverallApprovalRate(
                totalRequestsSubmitted > 0 ? (double) totalRequestsApproved / totalRequestsSubmitted : 0.0);
        summary.setOverallRejectionRate(
                totalRequestsSubmitted > 0 ? (double) totalRequestsRejected / totalRequestsSubmitted : 0.0);
        summary.setOverallFulfillmentRate(
                totalRequestsApproved > 0 ? (double) totalRequestsFulfilled / totalRequestsApproved : 0.0);

        // Generate top requesters (top 5 by request count)
        List<UserActivitySummaryDto.TopRequesterDto> topRequesters = userActivities.stream()
                .filter(user -> user.getTotalRequestsSubmitted() > 0)
                .sorted((a, b) -> Integer.compare(b.getTotalRequestsSubmitted(), a.getTotalRequestsSubmitted()))
                .limit(5)
                .map(user -> {
                    UserActivitySummaryDto.TopRequesterDto dto = new UserActivitySummaryDto.TopRequesterDto();
                    dto.setUserId(user.getUserId());
                    dto.setFullName(user.getFullName());
                    dto.setEmail(user.getEmail());
                    dto.setOfficeName(user.getOfficeName());
                    dto.setRequestCount(user.getTotalRequestsSubmitted());
                    dto.setItemCount(user.getTotalItemsRequested());
                    dto.setApprovalRate(user.getApprovalRate());
                    dto.setFulfillmentRate(user.getFulfillmentRate());
                    return dto;
                })
                .collect(Collectors.toList());
        summary.setTopRequesters(topRequesters);

        // Generate office activity breakdown
        Map<String, UserActivitySummaryDto.OfficeActivityDto> officeMap = new HashMap<>();
        for (UserActivityItemDto user : userActivities) {
            String officeName = user.getOfficeName();
            officeMap.computeIfAbsent(officeName, k -> {
                UserActivitySummaryDto.OfficeActivityDto dto = new UserActivitySummaryDto.OfficeActivityDto();
                dto.setOfficeId(user.getUserId()); // This would need actual office ID in real implementation
                dto.setOfficeName(officeName);
                dto.setUserCount(0);
                dto.setRequestCount(0);
                dto.setItemCount(0);
                return dto;
            });

            UserActivitySummaryDto.OfficeActivityDto office = officeMap.get(officeName);
            office.setUserCount(office.getUserCount() + 1);
            office.setRequestCount(office.getRequestCount() + user.getTotalRequestsSubmitted());
            office.setItemCount(office.getItemCount() + user.getTotalItemsRequested());
        }

        // Calculate average requests per user for each office
        List<UserActivitySummaryDto.OfficeActivityDto> officeActivity = officeMap.values().stream()
                .peek(office -> office.setAverageRequestsPerUser(
                        office.getUserCount() > 0 ? (double) office.getRequestCount() / office.getUserCount() : 0.0))
                .sorted((a, b) -> Integer.compare(b.getRequestCount(), a.getRequestCount()))
                .collect(Collectors.toList());
        summary.setOfficeActivity(officeActivity);

        return summary;
    }

    private String generateTimePeriodDescription(UserActivityReportRequest request) {
        if (request.getYear() != null) {
            if (request.getMonth() != null) {
                String[] monthNames = { "", "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" };
                return monthNames[request.getMonth()] + " " + request.getYear();
            } else {
                return "Year " + request.getYear();
            }
        } else if (request.getStartDate() != null && request.getEndDate() != null) {
            return request.getStartDate() + " to " + request.getEndDate();
        }
        return "All Time";
    }

    // Helper class for request statistics
    @Data
    private static class RequestStatistics {
        // Getters and setters
        private int totalSubmitted = 0;
        private int totalApproved = 0;
        private int totalRejected = 0;
        private int totalFulfilled = 0;
        private int pending = 0;
        // Removed value fields - using quantities only
        private LocalDateTime lastSubmitted;
        private LocalDateTime lastApproved;
        private LocalDateTime lastRejected;
        private LocalDateTime lastFulfilled;
        private LocalDateTime lastActivity;
        private int totalItemsRequested = 0;
        private int totalItemsApproved = 0;
        private int totalItemsRejected = 0;
        private int totalItemsFulfilled = 0;

    }
}
