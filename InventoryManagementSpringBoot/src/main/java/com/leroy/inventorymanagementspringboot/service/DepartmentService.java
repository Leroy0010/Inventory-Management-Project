package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.CreateDepartmentDto;
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
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService implements DepartmentServiceInterface {
    private final DepartmentMapper departmentMapper;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public DepartmentService(DepartmentMapper departmentMapper, DepartmentRepository departmentRepository, UserRepository userRepository) {
        this.departmentMapper = departmentMapper;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }


    @Override
    @Auditable(action = AuditAction.CREATE, entityClass = Department.class)
    @Transactional
    public Department addDepartment(CreateDepartmentDto departmentDto) {
        if (departmentRepository.existsByName(departmentDto.getName())) {
            throw new DepartmentAlreadyExistsException(
                    "Department with name '" + departmentDto.getName() + "' already exists");
        }

        try {
            Department department = departmentMapper.toDepartment(departmentDto);
            return departmentRepository.save(department);
        } catch (Exception e) {
            throw new DepartmentCreationException("Failed to create department", e);
        }
    }

    @Override
    public String getCurrentUserDepartmentName(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        System.out.println("User Department: " +  user.getDepartment().getName());
        if(user.getDepartment().getName().isEmpty())
            throw new ResourceNotFoundException("User department name is empty");
        return user.getDepartment().getName();
    }



    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
}
