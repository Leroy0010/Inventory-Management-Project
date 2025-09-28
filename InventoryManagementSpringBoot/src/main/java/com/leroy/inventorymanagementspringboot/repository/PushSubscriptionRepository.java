package com.leroy.inventorymanagementspringboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leroy.inventorymanagementspringboot.entity.PushSubscription;
import com.leroy.inventorymanagementspringboot.entity.User;

/**
 * Repository interface for managing PushSubscription entities.
 * Provides CRUD operations and custom queries for push notification
 * subscriptions.
 */
@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {

    /**
     * Find all active push subscriptions for a specific user.
     *
     * @param user The user to find subscriptions for
     * @return List of active push subscriptions for the user
     */
    List<PushSubscription> findByUserAndIsActiveTrue(User user);

    /**
     * Find all active push subscriptions for a specific user ID.
     *
     * @param userId The user ID to find subscriptions for
     * @return List of active push subscriptions for the user
     */
    @Query("SELECT ps FROM PushSubscription ps WHERE ps.user.id = :userId AND ps.isActive = true")
    List<PushSubscription> findByUserIdAndIsActiveTrue(@Param("userId") Long userId);

    /**
     * Find a push subscription by endpoint.
     *
     * @param endpoint The endpoint to search for
     * @return Optional containing the push subscription if found
     */
    Optional<PushSubscription> findByEndpoint(String endpoint);

    /**
     * Find a push subscription by endpoint and user.
     *
     * @param endpoint The endpoint to search for
     * @param user     The user to search for
     * @return Optional containing the push subscription if found
     */
    Optional<PushSubscription> findByEndpointAndUser(String endpoint, User user);

    /**
     * Find a push subscription by endpoint and user ID.
     *
     * @param endpoint The endpoint to search for
     * @param userId   The user ID to search for
     * @return Optional containing the push subscription if found
     */
    Optional<PushSubscription> findByEndpointAndUserId(String endpoint, Integer userId);

    /**
     * Count active subscriptions for a user.
     *
     * @param user The user to count subscriptions for
     * @return Number of active subscriptions
     */
    long countByUserAndIsActiveTrue(User user);

    /**
     * Deactivate all subscriptions for a user.
     *
     * @param user The user to deactivate subscriptions for
     */
    @Query("UPDATE PushSubscription ps SET ps.isActive = false, ps.updatedAt = CURRENT_TIMESTAMP WHERE ps.user = :user")
    void deactivateAllByUser(@Param("user") User user);

    /**
     * Find all active subscriptions (for broadcasting to all users).
     *
     * @return List of all active push subscriptions
     */
    List<PushSubscription> findByIsActiveTrue();
}
