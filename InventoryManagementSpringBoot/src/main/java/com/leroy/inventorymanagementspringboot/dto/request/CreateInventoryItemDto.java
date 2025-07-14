package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateInventoryItemDto {
    @NotBlank(message = "Inventory name can't be empty")
    private String name;

    private String description;

    @NotBlank(message = "Image path can't be empty")
    private String imagePath;
    @NotBlank(message = "Unit of item can't be empty")
    private String unit;
    private int reorderLevel;
}
