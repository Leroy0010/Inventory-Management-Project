package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {

    /**
     * Find user settings by user ID
     */
    @Query("SELECT us FROM UserSettings us WHERE us.user.id = :userId")
    Optional<UserSettings> findByUserId(@Param("userId") Integer userId);

    /**
     * Find user settings by user email
     */
    @Query("SELECT us FROM UserSettings us WHERE us.user.email = :email")
    Optional<UserSettings> findByUserEmail(@Param("email") String email);

    /**
     * Check if user settings exist for a user
     */
    @Query("SELECT COUNT(us) > 0 FROM UserSettings us WHERE us.user.id = :userId")
    boolean existsByUserId(@Param("userId") Integer userId);

    /**
     * Delete user settings by user ID
     */
    @Modifying
    @Query("DELETE FROM UserSettings us WHERE us.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);

    /**
     * Find users with specific theme preference
     */
    @Query("SELECT us FROM UserSettings us WHERE us.theme = :theme")
    java.util.List<UserSettings> findByTheme(@Param("theme") String theme);

    /**
     * Find users with email notifications enabled
     */
    @Query("SELECT us FROM UserSettings us WHERE us.emailNotifications = true")
    java.util.List<UserSettings> findUsersWithEmailNotificationsEnabled();

    /**
     * Find users with push notifications enabled
     */
    @Query("SELECT us FROM UserSettings us WHERE us.pushNotifications = true")
    java.util.List<UserSettings> findUsersWithPushNotificationsEnabled();

    /**
     * Find users with specific language preference
     */
    @Query("SELECT us FROM UserSettings us WHERE us.language = :language")
    java.util.List<UserSettings> findByLanguage(@Param("language") String language);

    // Note: Advanced queries for JSONB fields are temporarily disabled
    // These can be implemented later using custom repository methods

    /**
     * Find users with two-factor authentication enabled
     */
    @Query("SELECT us FROM UserSettings us WHERE us.twoFactorEnabled = true")
    java.util.List<UserSettings> findUsersWithTwoFactorEnabled();

    /**
     * Count users by theme preference
     */
    @Query("SELECT us.theme, COUNT(us) FROM UserSettings us GROUP BY us.theme")
    java.util.List<Object[]> countUsersByTheme();

    /**
     * Count users by language preference
     */
    @Query("SELECT us.language, COUNT(us) FROM UserSettings us GROUP BY us.language")
    java.util.List<Object[]> countUsersByLanguage();

    /**
     * Count users by notification preferences
     */
    @Query("SELECT " +
            "SUM(CASE WHEN us.emailNotifications = true THEN 1 ELSE 0 END) as emailEnabled, " +
            "SUM(CASE WHEN us.pushNotifications = true THEN 1 ELSE 0 END) as pushEnabled, " +
            "SUM(CASE WHEN us.inAppNotifications = true THEN 1 ELSE 0 END) as inAppEnabled " +
            "FROM UserSettings us")
    Object[] countNotificationPreferences();
}
