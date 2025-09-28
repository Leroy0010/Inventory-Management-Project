package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @Column(nullable = false)
    @Min(value = 1)
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private InventoryItem inventoryItem;

    public CartItem() {
    }

    public CartItem(Cart cart, int quantity, InventoryItem inventoryItem) {
        this.cart = cart;
        this.quantity = quantity;
        this.inventoryItem = inventoryItem;
    }

    @Override
    public String toString() {
        return "CartItem{" +
                "id=" + id +
                ", cart=" + cart +
                ", quantity=" + quantity +
                ", inventoryItem=" + inventoryItem +
                '}';
    }
}
