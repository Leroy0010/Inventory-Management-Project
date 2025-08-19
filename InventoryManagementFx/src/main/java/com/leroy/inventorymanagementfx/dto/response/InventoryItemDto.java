package com.leroy.inventorymanagementfx.dto.response;

/**
 * DTO for inventory item ID and Name, used for populating item selection.
 * Updated to include 'description' field to match backend response.
 */
public class InventoryItemDto {
    private Integer id;
    private String name;
    private String description; // ADDED THIS FIELD
    private String unit;
    private String imagePath;
    private int reorderLevel;
    private int quantity;

    public InventoryItemDto(){}

    // Updated constructor to include description
    public InventoryItemDto(Integer id, String name, String description, String unit, String imagePath, int reorderLevel, int quantity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.imagePath = imagePath;
        this.reorderLevel = reorderLevel;
        this.quantity = quantity;
    }

    public InventoryItemDto(Integer id, String name) {
        this.id = id;
        this.name = name;
        
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // New getter for description
    public String getDescription() {
        return description;
    }

    // New setter for description
    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return name; // This is what will be displayed in the ComboBox by default
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(int reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
