package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;
import com.leroy.inventorymanagementspringboot.service.report.UserReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/user")
public class UserReportController {

    private final UserReportService userReportService;

    public UserReportController(UserReportService userReportService) {
        this.userReportService = userReportService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<UserReportItemDto>> getUserReport(@Valid @RequestBody UserReportRequest request) {
        return ResponseEntity.ok(userReportService.generateUserReport(request));
    }


}
