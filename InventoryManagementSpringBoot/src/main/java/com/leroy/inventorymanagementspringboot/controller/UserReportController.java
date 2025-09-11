package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.service.report.UserReportService;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/user")
public class UserReportController {

    private final UserReportService userReportService;
    private final UserRepository userRepository;

    public UserReportController(UserReportService userReportService, UserRepository userRepository) {
        this.userReportService = userReportService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<List<UserReportItemDto>> getUserReport(@Valid @RequestBody UserReportRequest request) {
        return ResponseEntity.ok(userReportService.generateUserReport(request));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserReportResponseDto> getAllUsersReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            UserDetails userDetails
    ) {
        // Get current user from database
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        UserReportResponseDto response = userReportService.getAllUsersReport(
                currentUser, year, search, sortBy, sortOrder
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<UserReportResponseDto> getDepartmentUserReport(
            @PathVariable Integer departmentId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder
    ) {
        UserReportResponseDto response = userReportService.getDepartmentUserReport(
                departmentId, year, search, sortBy, sortOrder
        );
        return ResponseEntity.ok(response);
    }
}
