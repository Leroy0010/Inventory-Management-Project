package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CartResponseDto {
    private Long cartId;
    private int userId;
    private List<CartItemResponseDto> items;
}
