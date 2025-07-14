package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.dto.request.CartItemRequestDto;
import com.leroy.inventorymanagementspringboot.dto.response.CartResponseDto;
import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.mapper.CartMapper;
import com.leroy.inventorymanagementspringboot.repository.*;
import com.leroy.inventorymanagementspringboot.servicei.CartServiceInterface;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class CartService implements CartServiceInterface {

    private final CartRepository cartRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final CartMapper cartMapper;
    private final InventoryBatchRepository inventoryBatchRepository;
    private  final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       InventoryItemRepository inventoryItemRepository, CartMapper cartMapper, InventoryBatchRepository inventoryBatchRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.cartMapper = cartMapper;
        this.inventoryBatchRepository = inventoryBatchRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CartResponseDto getCart(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(new Cart(user)));
        return cartMapper.toCartResponseDto(cart);
    }

    @Override
    public CartResponseDto addItemToCart(CartItemRequestDto itemDto, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(new Cart(user)));

        InventoryItem item = inventoryItemRepository.findById(itemDto.getItemId())
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found"));
        // Check if item has enough stock (optional pre-check)

        int totalAvailable = inventoryBatchRepository.sumRemainingQuantityByItem(item);
        if (itemDto.getQuantity() > totalAvailable) {
            throw new IllegalArgumentException("Requested quantity exceeds available stock");
        }


        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(ci -> ci.getInventoryItem().getId() == item.getId())
                .findFirst();

        if (existingItem.isPresent()) {
            throw new IllegalArgumentException("Item already in cart");
        } else {
            CartItem newItem = new CartItem(cart, itemDto.getQuantity(), item);
            cart.getItems().add(newItem);

        }

        return cartMapper.toCartResponseDto(cartRepository.save(cart));
    }

    @Override
    public CartResponseDto removeItemFromCart(int cartItemId, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        boolean ifRemoved = cart.getItems().removeIf(item -> item.getId() == cartItemId);
        if (ifRemoved) throw new EntityNotFoundException("Item not not found in cart");
        return cartMapper.toCartResponseDto(cartRepository.save(cart));
    }

    @Override
    public CartResponseDto clearCart(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        cart.getItems().clear();
        return cartMapper.toCartResponseDto(cartRepository.save(cart));
    }

    @Override
    public CartResponseDto updateItemInCart(CartItemRequestDto itemDto, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        InventoryItem item = inventoryItemRepository.findById(itemDto.getItemId())
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found"));

        int totalAvailable = inventoryBatchRepository.sumRemainingQuantityByItem(item);
        if (itemDto.getQuantity() > totalAvailable) {
            throw new IllegalArgumentException("Requested quantity exceeds available stock");
        }
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        cart.getItems().stream()
                .filter(i -> i.getInventoryItem().getId() == itemDto.getItemId())
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Item not found in cart"))
                .setQuantity(itemDto.getQuantity());

        return cartMapper.toCartResponseDto(cartRepository.save(cart));
    }

}
