package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import com.leroy.inventorymanagementspringboot.entity.Notification;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.isRead = FALSE ORDER BY n.createdAt DESC")
    List<Notification> findByUserAndReadIsFalse(User user);

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUser(User user);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = FALSE")
    Long countNotificationsByUserAndIsReadIsFalse(User user);

    List<Notification> findByUser_IdAndType(int userId, NotificationType type);

    void deleteAllByUser_IdAndCreatedAtBefore(int userId, LocalDateTime cutoff);

    @Query("""
            SELECT n FROM Notification n\s
            WHERE n.user = :user\s
              AND n.inventoryItem = :item\s
              AND n.type = :type\s
              AND n.createdAt >= :since\s
            ORDER BY n.createdAt DESC
                             \s""")
    List<Notification> findRecentByUserAndItemAndType(
            @Param("user") User user,
            @Param("item") InventoryItem item,
            @Param("type") NotificationType type,
            @Param("since") LocalDateTime since);

    void deleteAllByCreatedAtBefore(LocalDateTime cutoff);

    // Dashboard methods
    long countByIsReadFalse();

    long countByUserAndIsReadFalse(User user);
}