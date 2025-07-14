package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateOfficeDto {
    @NotBlank(message = "Office name can't be empty")
    private String name;
}
