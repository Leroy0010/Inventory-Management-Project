package com.leroy.inventorymanagementfx.dto.response;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CartItemResponse {
    private int id;
    private int itemId;
    private String itemName;
    private int quantity;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
    @JsonCreator
    public CartItemResponse(
            @JsonProperty("id") int id,
            @JsonProperty("itemId") int itemId,
            @JsonProperty("itemName") String itemName,
            @JsonProperty("quantity") int quantity
    ){
        this.id = id;
        this.itemId = itemId;
        this.itemName = itemName;
        this.quantity = quantity;
    }
}

