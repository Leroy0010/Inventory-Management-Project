package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.report.TransactionReportDto;
import com.leroy.inventorymanagementspringboot.dto.report.TransactionReportRequest;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.service.report.TransactionReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/transactions")
public class TransactionReportController {

    private final TransactionReportService transactionReportService;

    public TransactionReportController(TransactionReportService transactionReportService) {
        this.transactionReportService = transactionReportService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<TransactionReportDto> getReport(@Valid @RequestBody TransactionReportRequest request, @AuthenticationPrincipal User storekeeper) {
        return ResponseEntity.ok(transactionReportService.generateReport(request, storekeeper));
    }
}