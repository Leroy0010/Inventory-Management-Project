package com.leroy.inventorymanagementspringboot.servicei;

import org.springframework.security.core.userdetails.UserDetails;

import com.leroy.inventorymanagementspringboot.dto.request.CartItemRequestDto;
import com.leroy.inventorymanagementspringboot.dto.response.CartResponseDto;

public interface CartServiceInterface {
    CartResponseDto getCart(UserDetails user);
    CartResponseDto addItemToCart(CartItemRequestDto itemDto, UserDetails user);
    CartResponseDto removeItemFromCart(int itemId, UserDetails user);
    CartResponseDto clearCart(UserDetails user);
    CartResponseDto updateItemInCart(CartItemRequestDto itemDto, UserDetails user);
}
