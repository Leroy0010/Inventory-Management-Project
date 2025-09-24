package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.dashboard.AdminDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StaffDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StorekeeperDashboardDto;
import com.leroy.inventorymanagementspringboot.servicei.DashboardServiceInterface;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardServiceInterface dashboardService;

    public DashboardController(DashboardServiceInterface dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        AdminDashboardDto dashboard = dashboardService.getAdminDashboard(userDetails);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/storekeeper")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<StorekeeperDashboardDto> getStorekeeperDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        StorekeeperDashboardDto dashboard = dashboardService.getStorekeeperDashboard(userDetails);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<StaffDashboardDto> getStaffDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        StaffDashboardDto dashboard = dashboardService.getStaffDashboard(userDetails);
        return ResponseEntity.ok(dashboard);
    }
}
