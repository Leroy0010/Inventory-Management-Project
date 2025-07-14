package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.request.CreateDepartmentDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface DepartmentServiceInterface {
    Department addDepartment(CreateDepartmentDto departmentDto);
    String getCurrentUserDepartmentName(UserDetails userDetails);
    List<Department> getAllDepartments();
}
