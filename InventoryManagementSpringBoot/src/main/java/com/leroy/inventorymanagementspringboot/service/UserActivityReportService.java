package com.leroy.inventorymanagementspringboot.service.report;

import com.leroy.inventorymanagementspringboot.dto.report.*;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.*;
import com.leroy.inventorymanagementspringboot.servicei.UserActivityReportServiceInterface;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

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
    public UserActivityReportResponseDto generateUserActivityReport(UserActivityReportRequest request, User currentUser) {
        // Get current user's department
        Integer departmentId = currentUser.getDepartment().getId();
        
        // Generate report for the department
        return generateDepartmentUserActivityReport(request, departmentId, currentUser);
    }

    @Override
    public UserActivityReportResponseDto generateOfficeUserActivityReport(UserActivityReportRequest request, Integer officeId) {
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
                .map(d -> d.getName())
                .orElse("Unknown Department");

        // Get user activities for the department
        List<UserActivityItemDto> userActivities = getUserActivitiesForDepartment(
                departmentId, request, officeId);

        // Generate summary statistics
        UserActivitySummaryDto summary = generateSummaryStatistics(userActivities, departmentId);

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
                                                                   Integer officeId) {
        // This would typically use a custom repository method
        // For now, we'll use the existing repository methods and build the data
        
        // Get all users in the department
        List<User> users = userRepository.findByDepartmentId(departmentId);
        
        // Filter by office if specified
        if (officeId != null) {
            users = users.stream()
                    .filter(user -> user.getOffice() != null && user.getOffice().getId() == officeId)
                    .collect(Collectors.toList());
        }

        // Apply additional filters
        if (request.getSearch() != null && !request.getSearch().trim().isEmpty()) {
            String searchTerm = request.getSearch().toLowerCase();
            users = users.stream()
                    .filter(user -> 
                        user.getFullName().toLowerCase().contains(searchTerm) ||
                        user.getEmail().toLowerCase().contains(searchTerm))
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
        dto.setUserName(user.getFullName());
        dto.setUserEmail(user.getEmail());
        dto.setUserRole(user.getRole() != null ? user.getRole().getName() : "UNKNOWN");
        dto.setOfficeName(user.getOffice() != null ? user.getOffice().getName() : "No Office");
        dto.setDepartmentName(user.getDepartment() != null ? user.getDepartment().getName() : "No Department");
        dto.setIsActive(user.isActive());
        
        // Set request statistics
        dto.setTotalRequestsSubmitted(requestStats.getTotalSubmitted());
        dto.setTotalRequestsApproved(requestStats.getTotalApproved());
        dto.setTotalRequestsRejected(requestStats.getTotalRejected());
        dto.setTotalRequestsFulfilled(requestStats.getTotalFulfilled());
        dto.setPendingRequests(requestStats.getPending());
        
        // Set value statistics
        dto.setTotalValueRequested(requestStats.getTotalValueRequested());
        dto.setTotalValueApproved(requestStats.getTotalValueApproved());
        dto.setTotalValueRejected(requestStats.getTotalValueRejected());
        dto.setTotalValueFulfilled(requestStats.getTotalValueFulfilled());
        
        // Set timestamps
        dto.setLastRequestSubmitted(requestStats.getLastSubmitted());
        dto.setLastRequestApproved(requestStats.getLastApproved());
        dto.setLastRequestRejected(requestStats.getLastRejected());
        dto.setLastRequestFulfilled(requestStats.getLastFulfilled());
        dto.setLastActivity(requestStats.getLastActivity());
        
        // Set item counts
        dto.setTotalItemsRequested(requestStats.getTotalItemsRequested());
        dto.setTotalItemsApproved(requestStats.getTotalItemsApproved());
        dto.setTotalItemsRejected(requestStats.getTotalItemsRejected());
        dto.setTotalItemsFulfilled(requestStats.getTotalItemsFulfilled());
        
        return dto;
    }

    private RequestStatistics getRequestStatisticsForUser(Integer userId, UserActivityReportRequest request) {
        // This would typically use custom repository queries
        // For now, we'll return mock data - in real implementation, this would query the database
        
        // TODO: Implement actual database queries
        return new RequestStatistics();
    }

    private UserActivitySummaryDto generateSummaryStatistics(List<UserActivityItemDto> userActivities, Integer departmentId) {
        // Calculate summary statistics
        int totalUsers = userActivities.size();
        int activeUsers = (int) userActivities.stream().filter(UserActivityItemDto::getIsActive).count();
        int inactiveUsers = totalUsers - activeUsers;
        
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
        
        // Calculate value totals
        var totalValueRequested = userActivities.stream()
                .map(UserActivityItemDto::getTotalValueRequested)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        var totalValueApproved = userActivities.stream()
                .map(UserActivityItemDto::getTotalValueApproved)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        
        return new UserActivitySummaryDto(
                totalUsers, activeUsers, inactiveUsers,
                totalRequestsSubmitted, totalRequestsApproved, totalRequestsRejected, totalRequestsFulfilled,
                totalValueRequested, totalValueApproved
        );
    }

    private String generateTimePeriodDescription(UserActivityReportRequest request) {
        if (request.getYear() != null) {
            return "Year " + request.getYear();
        } else if (request.getStartDate() != null && request.getEndDate() != null) {
            return request.getStartDate() + " to " + request.getEndDate();
        }
        return "All Time";
    }

    // Helper class for request statistics
    private static class RequestStatistics {
        private int totalSubmitted = 0;
        private int totalApproved = 0;
        private int totalRejected = 0;
        private int totalFulfilled = 0;
        private int pending = 0;
        private java.math.BigDecimal totalValueRequested = java.math.BigDecimal.ZERO;
        private java.math.BigDecimal totalValueApproved = java.math.BigDecimal.ZERO;
        private java.math.BigDecimal totalValueRejected = java.math.BigDecimal.ZERO;
        private java.math.BigDecimal totalValueFulfilled = java.math.BigDecimal.ZERO;
        private LocalDateTime lastSubmitted;
        private LocalDateTime lastApproved;
        private LocalDateTime lastRejected;
        private LocalDateTime lastFulfilled;
        private LocalDateTime lastActivity;
        private int totalItemsRequested = 0;
        private int totalItemsApproved = 0;
        private int totalItemsRejected = 0;
        private int totalItemsFulfilled = 0;

        // Getters and setters
        public int getTotalSubmitted() { return totalSubmitted; }
        public void setTotalSubmitted(int totalSubmitted) { this.totalSubmitted = totalSubmitted; }
        public int getTotalApproved() { return totalApproved; }
        public void setTotalApproved(int totalApproved) { this.totalApproved = totalApproved; }
        public int getTotalRejected() { return totalRejected; }
        public void setTotalRejected(int totalRejected) { this.totalRejected = totalRejected; }
        public int getTotalFulfilled() { return totalFulfilled; }
        public void setTotalFulfilled(int totalFulfilled) { this.totalFulfilled = totalFulfilled; }
        public int getPending() { return pending; }
        public void setPending(int pending) { this.pending = pending; }
        public java.math.BigDecimal getTotalValueRequested() { return totalValueRequested; }
        public void setTotalValueRequested(java.math.BigDecimal totalValueRequested) { this.totalValueRequested = totalValueRequested; }
        public java.math.BigDecimal getTotalValueApproved() { return totalValueApproved; }
        public void setTotalValueApproved(java.math.BigDecimal totalValueApproved) { this.totalValueApproved = totalValueApproved; }
        public java.math.BigDecimal getTotalValueRejected() { return totalValueRejected; }
        public void setTotalValueRejected(java.math.BigDecimal totalValueRejected) { this.totalValueRejected = totalValueRejected; }
        public java.math.BigDecimal getTotalValueFulfilled() { return totalValueFulfilled; }
        public void setTotalValueFulfilled(java.math.BigDecimal totalValueFulfilled) { this.totalValueFulfilled = totalValueFulfilled; }
        public LocalDateTime getLastSubmitted() { return lastSubmitted; }
        public void setLastSubmitted(LocalDateTime lastSubmitted) { this.lastSubmitted = lastSubmitted; }
        public LocalDateTime getLastApproved() { return lastApproved; }
        public void setLastApproved(LocalDateTime lastApproved) { this.lastApproved = lastApproved; }
        public LocalDateTime getLastRejected() { return lastRejected; }
        public void setLastRejected(LocalDateTime lastRejected) { this.lastRejected = lastRejected; }
        public LocalDateTime getLastFulfilled() { return lastFulfilled; }
        public void setLastFulfilled(LocalDateTime lastFulfilled) { this.lastFulfilled = lastFulfilled; }
        public LocalDateTime getLastActivity() { return lastActivity; }
        public void setLastActivity(LocalDateTime lastActivity) { this.lastActivity = lastActivity; }
        public int getTotalItemsRequested() { return totalItemsRequested; }
        public void setTotalItemsRequested(int totalItemsRequested) { this.totalItemsRequested = totalItemsRequested; }
        public int getTotalItemsApproved() { return totalItemsApproved; }
        public void setTotalItemsApproved(int totalItemsApproved) { this.totalItemsApproved = totalItemsApproved; }
        public int getTotalItemsRejected() { return totalItemsRejected; }
        public void setTotalItemsRejected(int totalItemsRejected) { this.totalItemsRejected = totalItemsRejected; }
        public int getTotalItemsFulfilled() { return totalItemsFulfilled; }
        public void setTotalItemsFulfilled(int totalItemsFulfilled) { this.totalItemsFulfilled = totalItemsFulfilled; }
    }
}
