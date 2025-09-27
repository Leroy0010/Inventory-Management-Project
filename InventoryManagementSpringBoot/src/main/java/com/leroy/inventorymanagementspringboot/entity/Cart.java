package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items;

    public Cart() {
        this.items = new ArrayList<>();
    }

    public Cart(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.items = new ArrayList<>();
    }

    @Override
    public String toString() {
        return "< Id: " + id + " User: " + user;
    }
}
