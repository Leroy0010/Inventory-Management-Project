package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.dashboard.InventorySummaryDto;
import com.leroy.inventorymanagementspringboot.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/inventory-summary")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<InventorySummaryDto> getInventorySummary(@AuthenticationPrincipal UserDetails userDetails) {
        InventorySummaryDto summary = dashboardService.getInventorySummary(userDetails);
        return ResponseEntity.ok(summary);
    }
}