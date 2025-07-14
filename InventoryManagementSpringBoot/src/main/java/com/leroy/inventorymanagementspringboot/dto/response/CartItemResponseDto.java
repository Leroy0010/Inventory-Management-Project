package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CartItemResponseDto {
    private int id;
    private int itemId;
    private String itemName;
    private int quantity;
}
