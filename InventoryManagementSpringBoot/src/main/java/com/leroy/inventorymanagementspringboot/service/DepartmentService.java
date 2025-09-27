package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.CreateDepartmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.DepartmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.DepartmentResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import com.leroy.inventorymanagementspringboot.exception.DepartmentAlreadyExistsException;
import com.leroy.inventorymanagementspringboot.exception.DepartmentCreationException;
import com.leroy.inventorymanagementspringboot.exception.ResourceNotFoundException;
import com.leroy.inventorymanagementspringboot.mapper.DepartmentMapper;
import com.leroy.inventorymanagementspringboot.repository.DepartmentRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.servicei.DepartmentServiceInterface;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class DepartmentService implements DepartmentServiceInterface {

    private final DepartmentMapper departmentMapper;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    @Auditable(action = AuditAction.CREATE, entityClass = Department.class)
    @Transactional
    public DepartmentDto addDepartment(CreateDepartmentDto departmentDto) {

        if (departmentRepository.existsByName(departmentDto.getName())) {
            throw new DepartmentAlreadyExistsException("Department already exists");
        }

        try {
            Department department = departmentMapper.toDepartment(departmentDto);
            department.setActive(true);
            department.setCreatedAt(LocalDateTime.now());
            department.setUpdatedAt(LocalDateTime.now());

            Department saved = departmentRepository.save(department);
            return departmentMapper.toDepartmentDto(saved);
        } catch (Exception e) {
            throw new DepartmentCreationException("Failed to create department", e);
        }
    }

    @Override
    public String getCurrentUserDepartmentName(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String deptName = user.getDepartment().getName();
        if (deptName == null || deptName.isBlank()) {
            throw new ResourceNotFoundException("User department name is empty");
        }
        return deptName;
    }

    public List<String> getAllDepartmentNames() {
        return departmentRepository.findAll()
                .stream()
                .map(Department::getName)
                .toList();
    }

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toDepartmentDto)
                .toList();
    }

    public List<DepartmentResponseDto> fetchAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        List<DepartmentResponseDto> responseDto = new ArrayList<>();
        var storekeeperRole = "STOREKEEPER";

        for (Department department : departments) {
            DepartmentResponseDto dto = departmentMapper.toDepartmentResponseDto(department);

            // Head of department
            userRepository.findByDepartmentAndRoleName(department, storekeeperRole)
                    .ifPresent(user -> dto.setHeadOfDepartment(user.getFullName()));

            // Staff count
            long staffCount = userRepository.countByOffice_Department(department);
            dto.setStaffCount((int) staffCount);

            responseDto.add(dto);
        }
        return responseDto;
    }
}
