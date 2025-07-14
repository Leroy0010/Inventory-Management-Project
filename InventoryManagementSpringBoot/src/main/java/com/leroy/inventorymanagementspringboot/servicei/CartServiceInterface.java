package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.request.CartItemRequestDto;
import com.leroy.inventorymanagementspringboot.dto.response.CartResponseDto;
import org.springframework.security.core.userdetails.UserDetails;

public interface CartServiceInterface {
    CartResponseDto getCart(UserDetails user);
    CartResponseDto addItemToCart(CartItemRequestDto itemDto, UserDetails user);
    CartResponseDto removeItemFromCart(int cartItemId, UserDetails user);
    CartResponseDto clearCart(UserDetails user);
    CartResponseDto updateItemInCart(CartItemRequestDto itemDto, UserDetails user);
}
