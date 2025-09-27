package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@AllArgsConstructor
@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // ===== CORE/COMMON SETTINGS (frequently accessed) =====

    // General Settings
    @Column(name = "theme", length = 20)
    private String theme = "system";

    @Column(name = "language", length = 5)
    private String language = "en";

    @Column(name = "timezone", length = 50)
    private String timezone;

    @Column(name = "auto_save")
    private Boolean autoSave = true;

    // Notification Settings (commonly used)
    @Column(name = "email_notifications")
    private Boolean emailNotifications = true;

    @Column(name = "push_notifications")
    private Boolean pushNotifications = true;

    @Column(name = "in_app_notifications")
    private Boolean inAppNotifications = true;

    // Privacy Settings (commonly accessed)
    @Column(name = "profile_visibility", length = 20)
    private String profileVisibility = "department";

    @Column(name = "activity_tracking")
    private Boolean activityTracking = true;

    @Column(name = "marketing_emails")
    private Boolean marketingEmails = false;

    // Application Settings (frequently used)
    @Column(name = "dashboard_layout", length = 20)
    private String dashboardLayout = "comfortable";

    @Column(name = "default_page_size")
    private Integer defaultPageSize = 25;

    @Column(name = "auto_refresh")
    private Boolean autoRefresh = true;

    @Column(name = "refresh_interval")
    private Integer refreshInterval = 30;

    @Column(name = "report_format", length = 10)
    private String reportFormat = "pdf";

    // Security Settings (important for security)
    @Column(name = "two_factor_enabled")
    private Boolean twoFactorEnabled = false;

    @Column(name = "session_timeout")
    private Integer sessionTimeout = 60;

    @Column(name = "login_notifications")
    private Boolean loginNotifications = true;

    // ===== ADVANCED/EXTENDED SETTINGS (stored as JSON for flexibility) =====

    @Column(name = "advanced_settings", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String advancedSettings;

    // ===== METADATA =====

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "version", length = 10)
    private String version = "1.0.0";

    // Constructors
    public UserSettings(User user) {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.user = user;
        // Initialize advanced settings with empty JSON object
        this.advancedSettings = "{}";
    }

    public UserSettings() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        // Initialize advanced settings with empty JSON object
        this.advancedSettings = "{}";
    }

    // JPA Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}