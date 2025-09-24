package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.CreateDepartmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.DepartmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.DepartmentResponseDto;
import com.leroy.inventorymanagementspringboot.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DepartmentDto> addDepartment(@Valid @RequestBody CreateDepartmentDto department) {
        DepartmentDto savedDepartment = departmentService.addDepartment(department);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDepartment);
    }

    @GetMapping("/names")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<String>> getAllDepartmentNames() {
        return ResponseEntity.ok(departmentService.getAllDepartmentNames());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/admin/get-all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<DepartmentResponseDto>> fetchAllDepartments() {
        return ResponseEntity.ok(departmentService.fetchAllDepartments());
    }

    @GetMapping("/current-user")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<String> getDepartmentName(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(departmentService.getCurrentUserDepartmentName(userDetails));
    }
}
