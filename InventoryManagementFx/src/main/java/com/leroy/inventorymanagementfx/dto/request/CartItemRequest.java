package com.leroy.inventorymanagementfx.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CartItemRequest {
    @JsonProperty("itemId")
    private Integer id;
    @JsonProperty("quantity")
    private int quantity;

    public CartItemRequest(int id, int quantity) {
        this.id = id;
        this.quantity = quantity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
