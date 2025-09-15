package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.dashboard.AdminDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StaffDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StorekeeperDashboardDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.servicei.DashboardServiceInterface;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<AdminDashboardDto> getAdminDashboard(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        AdminDashboardDto dashboard = dashboardService.getAdminDashboard(user);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/storekeeper")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<StorekeeperDashboardDto> getStorekeeperDashboard(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        StorekeeperDashboardDto dashboard = dashboardService.getStorekeeperDashboard(user);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<StaffDashboardDto> getStaffDashboard(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        StaffDashboardDto dashboard = dashboardService.getStaffDashboard(user);
        return ResponseEntity.ok(dashboard);
    }
}
