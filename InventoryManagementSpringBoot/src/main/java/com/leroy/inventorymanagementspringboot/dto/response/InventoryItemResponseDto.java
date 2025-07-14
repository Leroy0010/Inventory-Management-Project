package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryItemResponseDto {
    private int id;
    private String name;

    private String description;

    private String unit;

    private String imagePath;

    private int reorderLevel;

    private int quantity;
}
