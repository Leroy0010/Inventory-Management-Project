package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.request.CreateDepartmentDto;
import com.leroy.inventorymanagementspringboot.dto.response.DepartmentResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.DepartmentDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {



    @Mapping(target = "id",  ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt",  ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Department toDepartment(CreateDepartmentDto department);

    @Mapping(target = "staffCount", ignore = true)
    @Mapping(target = "headOfDepartment",  ignore = true)
    DepartmentResponseDto toDepartmentResponseDto(Department department);

    DepartmentDto toDepartmentDto(Department department);



}
