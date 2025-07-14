package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CartItemRequestDto {
    @NotNull(message = "Item ID is required")
    private Integer itemId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
