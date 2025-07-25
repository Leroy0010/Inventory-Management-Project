package com.leroy.inventorymanagementfx.dto.response;

/**
 * DTO for inventory item ID and Name, used for populating item selection.
 * Updated to include 'description' field to match backend response.
 */
public class InventoryItemDto {
    private Integer id;
    private String name;
    private String description; // ADDED THIS FIELD

    // Default constructor for Jackson
    public InventoryItemDto() {
    }

    // Updated constructor to include description
    public InventoryItemDto(Integer id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
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
}
