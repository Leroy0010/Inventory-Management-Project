package com.leroy.inventorymanagementfx.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class CartResponse {
    private Long cartId;
    private int userId;
    private List<CartItemResponse> items;

    // Getters and Setters
    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }
    
    @JsonCreator
    public CartResponse(
            @JsonProperty("cartId") long cartId,
            @JsonProperty("userId") int userId,
            @JsonProperty("items") List<CartItemResponse> items
    ) {
        this.cartId = cartId;
        this.userId = userId;
        this.items = items;
    }
}

