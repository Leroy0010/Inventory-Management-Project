package com.leroy.inventorymanagementspringboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leroy.inventorymanagementspringboot.entity.Cart;
import com.leroy.inventorymanagementspringboot.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartOrderByIdAsc(Cart cart);
}
