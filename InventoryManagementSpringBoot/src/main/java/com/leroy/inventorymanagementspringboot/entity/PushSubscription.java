package com.leroy.inventorymanagementspringboot.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a push notification subscription for a user.
 * Stores the necessary information to send push notifications to a user's
 * browser.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "push_subscriptions")
public class PushSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(name = "endpoint", nullable = false, length = 500)
    private String endpoint;

    @NotBlank
    @Column(name = "p256dh_key", nullable = false, length = 200)
    private String p256dhKey;

    @NotBlank
    @Column(name = "auth_key", nullable = false, length = 200)
    private String authKey;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Constructor for creating a new push subscription
     */
    public PushSubscription(User user, String endpoint, String p256dhKey, String authKey) {
        this.user = user;
        this.endpoint = endpoint;
        this.p256dhKey = p256dhKey;
        this.authKey = authKey;
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
