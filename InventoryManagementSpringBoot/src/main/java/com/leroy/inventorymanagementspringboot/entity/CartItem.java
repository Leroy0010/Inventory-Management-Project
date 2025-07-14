package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;


    @Column(nullable = false)
    @Size(min = 1)
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private InventoryItem  inventoryItem;

    public CartItem() {}

    public CartItem(Cart cart, int quantity,  InventoryItem inventoryItem) {
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
