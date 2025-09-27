package com.leroy.inventorymanagementspringboot.dto.settings;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdvancedSettings {

    // API Configuration
    private String apiKey;
    private String webhookUrl;

    // Integrations
    private Boolean slackIntegration = false;
    private Boolean teamsIntegration = false;
    private Boolean emailIntegration = true;

    // Debug & Logging
    private Boolean debugMode = false;
    private String logLevel = "info";

    // Performance
    private Boolean cacheEnabled = true;
    private Integer cacheTimeout = 15;

    // Experimental Features
    private Boolean experimentalFeatures = false;

    // Additional notification settings
    private String requestUpdates = "immediate";
    private String systemAlerts = "immediate";
    private String reportReady = "immediate";
    private Boolean weeklyDigest = true;
    private Boolean quietHoursEnabled = false;
    private String quietHoursStart = "22:00";
    private String quietHoursEnd = "08:00";
    private Boolean smsNotifications = false;
    private Boolean desktopNotifications = false;

    // UI Customization
    private String dateFormat = "MM/DD/YYYY";
    private String timeFormat = "12h";
    private String accentColor;
    private String fontFamily;
    private Integer fontSize;
    private Boolean animationsEnabled = true;
    private Boolean compactMode = false;
    private Boolean sidebarCollapsed = false;
    private Boolean showTutorials = true;

    // Privacy & Data
    private String dataSharing = "analytics";
    private Boolean analyticsOptIn = true;
    private Boolean showOnlineStatus = true;
    private Boolean allowDirectMessages = true;

    // Security
    private String twoFactorMethod = "email";
    private Integer passwordExpiry = 90;
    private Boolean requirePasswordChange = false;
    private Boolean trustedDevices = true;
    private Boolean apiAccess = false;

    // Export/Import
    private String exportLocation = "downloads";
    private Boolean autoExport = false;
    private Boolean autoBackup = false;
    private String backupFrequency = "weekly";
    private String backupLocation = "cloud";

    // Developer Tools
    private Boolean showDebugInfo = false;
    private Boolean enableLogging = true;
    private String logRetentionDays = "30";
}
