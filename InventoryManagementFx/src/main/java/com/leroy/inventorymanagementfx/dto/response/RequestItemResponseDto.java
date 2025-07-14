package com.leroy.inventorymanagementfx.dto.response;

public class RequestItemResponseDto {
    private int id; // ID of the RequestItem itself
    private String name; // Name of the InventoryItem
    private int quantity; // Requested quantity

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
