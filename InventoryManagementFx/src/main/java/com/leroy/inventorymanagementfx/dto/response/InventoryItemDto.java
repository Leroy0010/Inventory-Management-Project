package com.leroy.inventorymanagementfx.dto.response;

public class InventoryItemDto {
    private Integer id;
    private String name;

    // Default constructor for Jackson
    public InventoryItemDto() {
    }

    public InventoryItemDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

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

    @Override
    public String toString() {
        return name; // This is what will be displayed in the ComboBox by default
    }
}
