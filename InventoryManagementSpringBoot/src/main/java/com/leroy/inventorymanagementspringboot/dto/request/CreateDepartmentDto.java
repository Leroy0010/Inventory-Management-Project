package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class CreateDepartmentDto {
    @NotBlank(message = "Department name can't be empty")
    private String name;

    @Size(max= 500, message = "Department description can't be more than 500 characters")
    private String description;
}
