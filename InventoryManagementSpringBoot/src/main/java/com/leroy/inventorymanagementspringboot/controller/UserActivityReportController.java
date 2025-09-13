package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.report.UserActivityReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserActivityReportResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.report.UserActivityReportService;
import jakarta.validation.Valid;
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

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserActivityReportResponseDto> generateUserActivityReport(
            @Valid @RequestBody UserActivityReportRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Get current user from database
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        UserActivityReportResponseDto response = userActivityReportService
                .generateUserActivityReport(request, currentUser);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserActivityReportResponseDto> getUserActivitySummary(
            @RequestParam(required = false) Integer year,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Get current user from database
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        UserActivityReportResponseDto response = userActivityReportService
                .getUserActivitySummary(currentUser, year);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/office/{officeId}")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserActivityReportResponseDto> getOfficeUserActivityReport(
            @PathVariable Integer officeId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) Boolean activeOnly,
            @RequestParam(required = false) String roleFilter,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Build request from parameters
        UserActivityReportRequest request = new UserActivityReportRequest();
        request.setYear(year);
        request.setSearch(search);
        request.setSortBy(sortBy);
        request.setSortOrder(sortOrder);
        request.setActiveOnly(activeOnly);
        request.setRoleFilter(roleFilter);
        
        UserActivityReportResponseDto response = userActivityReportService
                .generateOfficeUserActivityReport(request, officeId);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/department")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserActivityReportResponseDto> getDepartmentUserActivityReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) Boolean activeOnly,
            @RequestParam(required = false) String roleFilter,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Get current user from database
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Build request from parameters
        UserActivityReportRequest request = new UserActivityReportRequest();
        request.setYear(year);
        request.setSearch(search);
        request.setSortBy(sortBy);
        request.setSortOrder(sortOrder);
        request.setActiveOnly(activeOnly);
        request.setRoleFilter(roleFilter);
        
        UserActivityReportResponseDto response = userActivityReportService
                .generateUserActivityReport(request, currentUser);
        
        return ResponseEntity.ok(response);
    }
}
