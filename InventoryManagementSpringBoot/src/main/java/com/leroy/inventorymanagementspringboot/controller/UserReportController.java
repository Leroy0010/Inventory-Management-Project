package com.leroy.inventorymanagementspringboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportResponseDto;
import com.leroy.inventorymanagementspringboot.service.UserReportService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/reports/user")
public class UserReportController {

    private final UserReportService userReportService;

    @GetMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserReportResponseDto> getUserReport(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {
        // Validate that at least userId and either year or date range is provided
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        if (year == null && (startDate == null || endDate == null)) {
            throw new IllegalArgumentException("Either year or date range (startDate and endDate) is required");
        }

        UserReportRequest request = new UserReportRequest();
        request.setUserId(userId);
        request.setYear(year);
        if (startDate != null) {
            request.setStartDate(java.time.LocalDate.parse(startDate));
        }
        if (endDate != null) {
            request.setEndDate(java.time.LocalDate.parse(endDate));
        }

        return ResponseEntity.ok(userReportService.generateUserReport(request, sortBy, sortOrder));
    }

}
