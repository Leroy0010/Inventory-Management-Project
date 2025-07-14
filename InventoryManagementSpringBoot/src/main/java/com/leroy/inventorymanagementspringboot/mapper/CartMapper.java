package com.leroy.inventorymanagementspringboot.mapper;

import com.leroy.inventorymanagementspringboot.dto.response.CartItemResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.CartResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Cart;
import com.leroy.inventorymanagementspringboot.entity.CartItem;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "userId", source = "user.id")
    CartResponseDto toCartResponseDto(Cart cart);

    @Mapping(target = "itemId", source = "inventoryItem.id")
    @Mapping(target = "itemName", source = "inventoryItem.name")
    CartItemResponseDto toCartItemResponseDto(CartItem cartItem);

    List<CartItemResponseDto> toCartItemResponseDtoList(List<CartItem> cartItems);

    @AfterMapping
    default void mapItems(@MappingTarget CartResponseDto dto, Cart cart) {
        dto.setItems(toCartItemResponseDtoList(cart.getItems()));
    }
}
