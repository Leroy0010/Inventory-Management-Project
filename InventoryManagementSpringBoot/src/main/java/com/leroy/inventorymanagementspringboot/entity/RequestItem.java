package com.leroy.inventorymanagementspringboot.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "request_items")
public class RequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "request_id")
    private Request request;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private InventoryItem item;

    private int quantity;

    public RequestItem() {}

    @Override
    public String toString() {
        return "RequestItem{" +
                "id=" + id +
                ", request=" + request +
                ", item=" + item +
                ", quantity=" + quantity +
                '}';
    }
}
