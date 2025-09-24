package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.report.UserActivityReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserActivityReportResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.UserActivityReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/user-activity")
public class UserActivityReportController {

    private final UserActivityReportService userActivityReportService;
    private final UserRepository userRepository;

    public UserActivityReportController(UserActivityReportService userActivityReportService,
            UserRepository userRepository) {
        this.userActivityReportService = userActivityReportService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserActivityReportResponseDto> getUserActivityReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer officeId,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) Boolean activeOnly,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Get current user from database
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Build request from parameters
        UserActivityReportRequest request = new UserActivityReportRequest();
        request.setYear(year);
        request.setMonth(month);
        if (startDate != null) {
            request.setStartDate(java.time.LocalDate.parse(startDate));
        }
        if (endDate != null) {
            request.setEndDate(java.time.LocalDate.parse(endDate));
        }
        request.setOfficeId(officeId);
        request.setUserId(userId);
        request.setSortBy(sortBy);
        request.setSortOrder(sortOrder);
        request.setActiveOnly(activeOnly);

        UserActivityReportResponseDto response = userActivityReportService
                .generateUserActivityReport(request, currentUser);

        return ResponseEntity.ok(response);
    }

}
