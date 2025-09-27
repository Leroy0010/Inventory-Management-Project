package com.leroy.inventorymanagementspringboot.entity;

import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String title;

    // Explicit getter methods to ensure they exist
    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private boolean isRead;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @ManyToOne
    @JoinColumn(name = "related_request_id")
    private Request request;

    @ManyToOne
    @JoinColumn(name = "related_item_id")
    private InventoryItem inventoryItem;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    public Notification() {
    }

    public Notification(User user, String title, String message, NotificationType type, LocalDateTime createdAt) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = createdAt;
        isRead = false;

    }

    public Notification(User user, String title, String message, NotificationType type, InventoryItem inventoryItem,
            LocalDateTime createdAt) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.type = type;
        this.inventoryItem = inventoryItem;
        this.createdAt = createdAt;
        isRead = false;
    }

    public Notification(User user, String title, String message, NotificationType type, Request request,
            LocalDateTime createdAt) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.type = type;
        this.request = request;
        this.createdAt = createdAt;
        isRead = false;
    }

    @Override
    public String toString() {
        return "Id: " + id + " Title: " + title +
                " Message: " + message + " Type: " +
                type + " Is Read: " + isRead;
    }
}
