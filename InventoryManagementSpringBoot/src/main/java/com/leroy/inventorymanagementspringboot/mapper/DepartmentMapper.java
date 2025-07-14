package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.request.CreateDepartmentDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    @Mapping(target = "id",  ignore = true)
    Department toDepartment(CreateDepartmentDto department);
}
