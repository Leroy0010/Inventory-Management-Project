package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.CreateDepartmentDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departments")  // Changed to plural for REST convention
public class DepartmentController {
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addDepartment(@Valid @RequestBody CreateDepartmentDto department) {
        try {
            Department savedDepartment = departmentService.addDepartment(department);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "An unexpected error occurred"));
        }
    }

    @GetMapping("/names")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<String>> getAllDepartmentNames() {
        try {
            var departments = departmentService.getAllDepartments()
                    .stream()
                    .map(Department::getName)
                    .toList();
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Department>> getAllDepartments() {
        try {
            return ResponseEntity.ok(departmentService.getAllDepartments());
        }  catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/current-user")
    @PreAuthorize("hasAuthority('STOREKEEPER')")
    public ResponseEntity<String> getDepartmentName(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(departmentService.getCurrentUserDepartmentName(userDetails));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }

    }

}