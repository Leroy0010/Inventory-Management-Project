package com.leroy.inventorymanagementspringboot.controller;


import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryReportRequest;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.service.report.InventorySummaryReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/inventory-summary")
public class InventorySummaryReportController {

    private final InventorySummaryReportService reportService;

    public InventorySummaryReportController(InventorySummaryReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<InventorySummaryItemDto>> generateSummary(
            @RequestBody InventorySummaryReportRequest request, @AuthenticationPrincipal User storekeeper
            ) {
        // Get the authenticated user's department
        Department department = storekeeper.getDepartment();

        // Extract method (if needed) from request
        CostFlowMethod method = request.getCostFlowMethod();

        List<InventorySummaryItemDto> result = reportService.generateReport(request, department, method);
        return ResponseEntity.ok(result);
    }
}

