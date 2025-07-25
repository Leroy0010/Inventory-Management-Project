package com.leroy.inventorymanagementspringboot.controller;


import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryReportRequest;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.report.InventorySummaryReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/inventory-summary")
public class InventorySummaryReportController {

    private final InventorySummaryReportService reportService;
    private final UserRepository userRepository;

    public InventorySummaryReportController(InventorySummaryReportService reportService, UserRepository userRepository) {
        this.reportService = reportService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<InventorySummaryItemDto>> generateSummary(
            @RequestBody InventorySummaryReportRequest request, @AuthenticationPrincipal UserDetails userDetails
            ) {
        // Get the authenticated user's department
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Username not found."));
        Department department = storekeeper.getDepartment();

        // Extract method (if needed) from request
        CostFlowMethod method = request.getCostFlowMethod();

        List<InventorySummaryItemDto> result = reportService.generateReport(request, department, method);
        return ResponseEntity.ok(result);
    }
}

