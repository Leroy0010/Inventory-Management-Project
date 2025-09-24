package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.request.CreateDepartmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.DepartmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.DepartmentResponseDto;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface DepartmentServiceInterface {
    DepartmentDto addDepartment(CreateDepartmentDto departmentDto);
    String getCurrentUserDepartmentName(UserDetails userDetails);
    List<DepartmentDto> getAllDepartments();

    List<DepartmentResponseDto> fetchAllDepartments();
}
