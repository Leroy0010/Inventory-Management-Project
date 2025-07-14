package com.leroy.inventorymanagementfx.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class InventoryItemResponse {
    private final int id;
    private final String name;
    private final String unit;
    private final String imagePath;
    private final int reorderLevel;
    private final String description;
    private final int quantity;

    @JsonCreator
    public InventoryItemResponse(
            @JsonProperty("id") int id,
            @JsonProperty("name") String name,
            @JsonProperty("unit") String unit,
            @JsonProperty("imagePath") String imagePath,
            @JsonProperty("reorderLevel") int reorderLevel,
            @JsonProperty("description") String description,
            @JsonProperty("quantity") int quantity) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.imagePath = imagePath;
        this.reorderLevel = reorderLevel;
        this.description = description;
        this.quantity = quantity;
    }

    // Getters remain the same
    public int getId() { return id; }
    public String getName() { return name; }
    public String getUnit() { return unit; }
    public String getImagePath() { return imagePath; }
    public int getReorderLevel() { return reorderLevel; }
    public String getDescription() { return description; }
    public int getQuantity() { return quantity; }
}