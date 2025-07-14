package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class CreateDepartmentDto {
    @NotBlank(message = "Department name can't be empty")
    private String name;
}
