package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateInventoryItemDto {
    @NotNull(message = "Item id can't be null") // For int, use @NotNull if it's Integer, or just rely on primitive default if int
    @Min(value = 1, message = "Item id must be positive") // Example validation
    private int id; // Changed from @NotBlank to proper int validation

    @NotBlank(message = "Item name can't be blank")
    private String name;

    private String description; // Description can be null/empty, so no @NotBlank

    @NotBlank(message = "Item unit can't be blank")
    private String unit;

    @NotBlank(message = "Image path can't be empty")
    private String imagePath;

    @NotNull(message = "Reorder Level can't be empty") // For int, use @NotNull
    @Min(value = 0, message = "Reorder Level cannot be negative") // Example validation
    private int reorderLevel; // Changed from @NotBlank to proper int validation

}