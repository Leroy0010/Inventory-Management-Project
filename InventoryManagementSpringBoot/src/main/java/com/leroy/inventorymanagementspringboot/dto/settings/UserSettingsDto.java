package com.leroy.inventorymanagementspringboot.dto.settings;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsDto {
    private Long id;
    private Integer userId;
    private String userEmail;
    private String userName;

    // General Settings
    private String theme;
    private String language;
    private String timezone;
    private Boolean autoSave;

    // Notification Settings
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Boolean inAppNotifications;

    // Privacy Settings
    private String profileVisibility;
    private Boolean activityTracking;
    private Boolean marketingEmails;

    // Application Settings
    private String dashboardLayout;
    private Integer defaultPageSize;
    private Boolean autoRefresh;
    private Integer refreshInterval;
    private String reportFormat;

    // Security Settings
    private Boolean twoFactorEnabled;
    private Integer sessionTimeout;
    private Boolean loginNotifications;

    // Advanced Settings (from JSON)
    private String apiKey;
    private String webhookUrl;
    private Boolean slackIntegration;
    private Boolean teamsIntegration;
    private Boolean emailIntegration;
    private Boolean debugMode;
    private String logLevel;
    private Boolean cacheEnabled;
    private Integer cacheTimeout;
    private Boolean experimentalFeatures;

    // Additional notification settings (from advanced JSON)
    private Boolean smsNotifications;
    private Boolean desktopNotifications;

    // Metadata
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    private String version;
}