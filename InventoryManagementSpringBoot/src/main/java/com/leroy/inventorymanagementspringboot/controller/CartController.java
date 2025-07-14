package com.leroy.inventorymanagementspringboot.controller;

import com.leroy.inventorymanagementspringboot.dto.request.CartItemRequestDto;
import com.leroy.inventorymanagementspringboot.dto.response.CartResponseDto;
import com.leroy.inventorymanagementspringboot.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add-item")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<CartResponseDto> addItemToCart(@Valid @RequestBody CartItemRequestDto itemDto, @AuthenticationPrincipal UserDetails staff) {
        return  ResponseEntity.status(HttpStatus.ACCEPTED).body(cartService.addItemToCart(itemDto, staff));
    }

    @PostMapping("/remove-item")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<CartResponseDto> removeItemFromCart(@Valid @RequestBody CartItemRequestDto itemDto, @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.status(HttpStatus.OK).body(cartService.removeItemFromCart(itemDto.getItemId(), staff));
    }

    @PutMapping("/update-item")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<CartResponseDto> updateItemInCart(@Valid @RequestBody CartItemRequestDto itemDto, @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.status(HttpStatus.OK).body(cartService.updateItemInCart(itemDto, staff));
    }

    @DeleteMapping("/clear")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<CartResponseDto> clearCart(@AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.status(HttpStatus.OK).body(cartService.clearCart(staff));
    }

    @GetMapping("/get")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<CartResponseDto> getCart(@AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.status(HttpStatus.OK).body(cartService.getCart(staff));
    }


}
