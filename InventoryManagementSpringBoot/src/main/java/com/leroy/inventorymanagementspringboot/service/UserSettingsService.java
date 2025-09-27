package com.leroy.inventorymanagementspringboot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementspringboot.dto.settings.AdvancedSettings;
import com.leroy.inventorymanagementspringboot.dto.settings.UserSettingsDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.entity.UserSettings;
import com.leroy.inventorymanagementspringboot.repository.UserSettingsRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * Get user settings by user ID
     */
    @Transactional(readOnly = true)
    public Optional<UserSettingsDto> getUserSettings(Integer userId) {
        log.debug("Getting settings for user ID: {}", userId);

        return userSettingsRepository.findByUserId(userId)
                .map(this::convertToDto);
    }

    /**
     * Get user settings by user email
     */
    @Transactional(readOnly = true)
    public Optional<UserSettingsDto> getUserSettingsByEmail(String email) {
        log.debug("Getting settings for user email: {}", email);

        return userSettingsRepository.findByUserEmail(email)
                .map(this::convertToDto);
    }

    /**
     * Create or update user settings
     */
    @Transactional
    public UserSettingsDto saveUserSettings(Integer userId, UserSettingsDto settingsDto) {
        log.debug("Saving settings for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElse(new UserSettings(user));

        // Update core settings
        updateCoreSettings(settings, settingsDto);

        // Update advanced settings JSON
        updateAdvancedSettings(settings, settingsDto);

        settings.setUpdatedAt(LocalDateTime.now());
        settings.setVersion("1.0.0");

        UserSettings savedSettings = userSettingsRepository.save(settings);
        log.info("Settings saved successfully for user ID: {}", userId);

        return convertToDto(savedSettings);
    }

    /**
     * Update specific settings category
     */
    @Transactional
    public UserSettingsDto updateSettingsCategory(Integer userId, String category, Object categorySettings) {
        log.debug("Updating {} settings for user ID: {}", category, userId);

        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User settings not found for user ID: " + userId));

        switch (category.toLowerCase()) {
            case "general" -> updateGeneralSettings(settings, categorySettings);
            case "notifications" -> updateNotificationSettings(settings, categorySettings);
            case "privacy" -> updatePrivacySettings(settings, categorySettings);
            case "application" -> updateApplicationSettings(settings, categorySettings);
            case "security" -> updateSecuritySettings(settings, categorySettings);
            case "advanced" -> updateAdvancedSettingsFromCategory(settings, categorySettings);
            default -> throw new IllegalArgumentException("Unknown settings category: " + category);
        }

        settings.setUpdatedAt(LocalDateTime.now());
        UserSettings savedSettings = userSettingsRepository.save(settings);

        return convertToDto(savedSettings);
    }

    /**
     * Reset user settings to defaults
     */
    @Transactional
    public UserSettingsDto resetToDefaults(Integer userId) {
        log.debug("Resetting settings to defaults for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Check if settings already exist for this user
        Optional<UserSettings> existingSettings = userSettingsRepository.findByUserId(userId);

        UserSettings settings;
        if (existingSettings.isPresent()) {
            // Update existing settings with default values
            settings = existingSettings.get();
            resetToDefaultValues(settings);
            settings = userSettingsRepository.save(settings);
            log.debug("Updated existing settings to defaults for user ID: {}", userId);
        } else {
            // Create new settings with default values
            settings = new UserSettings(user);
            settings = userSettingsRepository.save(settings);
            log.debug("Created new settings with defaults for user ID: {}", userId);
        }

        log.info("Settings reset to defaults for user ID: {}", userId);
        return convertToDto(settings);
    }

    /**
     * Reset all fields of a UserSettings object to default values
     */
    private void resetToDefaultValues(UserSettings settings) {
        // General Settings
        settings.setTheme("system");
        settings.setLanguage("en");
        settings.setTimezone(null);
        settings.setAutoSave(true);

        // Notification Settings
        settings.setEmailNotifications(true);
        settings.setPushNotifications(true);
        settings.setInAppNotifications(true);

        // Privacy Settings
        settings.setProfileVisibility("department");
        settings.setActivityTracking(true);
        settings.setMarketingEmails(false);

        // Application Settings
        settings.setDashboardLayout("comfortable");
        settings.setDefaultPageSize(25);
        settings.setAutoRefresh(true);
        settings.setRefreshInterval(30);
        settings.setReportFormat("pdf");

        // Security Settings
        settings.setTwoFactorEnabled(false);
        settings.setSessionTimeout(60);
        settings.setLoginNotifications(true);

        // Advanced Settings (reset to empty JSON)
        settings.setAdvancedSettings("{}");

        // Update timestamp
        settings.setUpdatedAt(LocalDateTime.now());
    }

    /**
     * Delete user settings
     */
    @Transactional
    public void deleteUserSettings(Integer userId) {
        log.debug("Deleting settings for user ID: {}", userId);

        userSettingsRepository.deleteByUserId(userId);
        log.info("Settings deleted for user ID: {}", userId);
    }

    /**
     * Check if user has settings
     */
    @Transactional(readOnly = true)
    public boolean hasUserSettings(Integer userId) {
        return userSettingsRepository.existsByUserId(userId);
    }

    // ===== PRIVATE HELPER METHODS =====

    private void updateCoreSettings(UserSettings settings, UserSettingsDto dto) {
        // General Settings
        if (dto.getTheme() != null)
            settings.setTheme(dto.getTheme());
        if (dto.getLanguage() != null)
            settings.setLanguage(dto.getLanguage());
        if (dto.getTimezone() != null)
            settings.setTimezone(dto.getTimezone());
        if (dto.getAutoSave() != null)
            settings.setAutoSave(dto.getAutoSave());

        // Notification Settings
        if (dto.getEmailNotifications() != null)
            settings.setEmailNotifications(dto.getEmailNotifications());
        if (dto.getPushNotifications() != null)
            settings.setPushNotifications(dto.getPushNotifications());
        if (dto.getInAppNotifications() != null)
            settings.setInAppNotifications(dto.getInAppNotifications());

        // Privacy Settings
        if (dto.getProfileVisibility() != null)
            settings.setProfileVisibility(dto.getProfileVisibility());
        if (dto.getActivityTracking() != null)
            settings.setActivityTracking(dto.getActivityTracking());
        if (dto.getMarketingEmails() != null)
            settings.setMarketingEmails(dto.getMarketingEmails());

        // Application Settings
        if (dto.getDashboardLayout() != null)
            settings.setDashboardLayout(dto.getDashboardLayout());
        if (dto.getDefaultPageSize() != null)
            settings.setDefaultPageSize(dto.getDefaultPageSize());
        if (dto.getAutoRefresh() != null)
            settings.setAutoRefresh(dto.getAutoRefresh());
        if (dto.getRefreshInterval() != null)
            settings.setRefreshInterval(dto.getRefreshInterval());
        if (dto.getReportFormat() != null)
            settings.setReportFormat(dto.getReportFormat());

        // Security Settings
        if (dto.getTwoFactorEnabled() != null)
            settings.setTwoFactorEnabled(dto.getTwoFactorEnabled());
        if (dto.getSessionTimeout() != null)
            settings.setSessionTimeout(dto.getSessionTimeout());
        if (dto.getLoginNotifications() != null)
            settings.setLoginNotifications(dto.getLoginNotifications());
    }

    private void updateAdvancedSettings(UserSettings settings, UserSettingsDto dto) {
        try {
            AdvancedSettings advancedSettings = getAdvancedSettings(settings);

            // Note: Advanced settings are now handled separately through the
            // AdvancedSettings DTO
            // This method is kept for backward compatibility but doesn't update advanced
            // settings
            // Advanced settings should be updated through the
            // updateAdvancedSettingsFromCategory method

            String json = objectMapper.writeValueAsString(advancedSettings);
            settings.setAdvancedSettings(json);

        } catch (JsonProcessingException e) {
            log.error("Error updating advanced settings for user ID: {}", settings.getUser().getId(), e);
            throw new RuntimeException("Failed to update advanced settings", e);
        }
    }

    private AdvancedSettings getAdvancedSettings(UserSettings settings) {
        if (settings.getAdvancedSettings() == null || settings.getAdvancedSettings().trim().isEmpty()) {
            return new AdvancedSettings();
        }

        try {
            return objectMapper.readValue(settings.getAdvancedSettings(), AdvancedSettings.class);
        } catch (JsonProcessingException e) {
            log.warn("Error parsing advanced settings JSON, using defaults", e);
            return new AdvancedSettings();
        }
    }

    private void updateGeneralSettings(UserSettings settings, Object categorySettings) {
        // Implementation for general settings update
        log.debug("Updating general settings");
    }

    private void updateNotificationSettings(UserSettings settings, Object categorySettings) {
        // Implementation for notification settings update
        log.debug("Updating notification settings");
    }

    private void updatePrivacySettings(UserSettings settings, Object categorySettings) {
        // Implementation for privacy settings update
        log.debug("Updating privacy settings");
    }

    private void updateApplicationSettings(UserSettings settings, Object categorySettings) {
        // Implementation for application settings update
        log.debug("Updating application settings");
    }

    private void updateSecuritySettings(UserSettings settings, Object categorySettings) {
        // Implementation for security settings update
        log.debug("Updating security settings");
    }

    private void updateAdvancedSettingsFromCategory(UserSettings settings, Object categorySettings) {
        try {
            AdvancedSettings advancedSettings = objectMapper.convertValue(categorySettings, AdvancedSettings.class);
            String json = objectMapper.writeValueAsString(advancedSettings);
            settings.setAdvancedSettings(json);
        } catch (JsonProcessingException e) {
            log.error("Error updating advanced settings from category", e);
            throw new RuntimeException("Failed to update advanced settings", e);
        }
    }

    private UserSettingsDto convertToDto(UserSettings settings) {
        UserSettingsDto dto = new UserSettingsDto();

        // Basic info
        dto.setId(settings.getId());
        dto.setUserId(settings.getUser().getId());
        dto.setUserEmail(settings.getUser().getEmail());
        dto.setUserName(settings.getUser().getFullName());

        // Core settings
        dto.setTheme(settings.getTheme());
        dto.setLanguage(settings.getLanguage());
        dto.setTimezone(settings.getTimezone());
        dto.setAutoSave(settings.getAutoSave());

        // Notification settings
        dto.setEmailNotifications(settings.getEmailNotifications());
        dto.setPushNotifications(settings.getPushNotifications());
        dto.setInAppNotifications(settings.getInAppNotifications());

        // Privacy settings
        dto.setProfileVisibility(settings.getProfileVisibility());
        dto.setActivityTracking(settings.getActivityTracking());
        dto.setMarketingEmails(settings.getMarketingEmails());

        // Application settings
        dto.setDashboardLayout(settings.getDashboardLayout());
        dto.setDefaultPageSize(settings.getDefaultPageSize());
        dto.setAutoRefresh(settings.getAutoRefresh());
        dto.setRefreshInterval(settings.getRefreshInterval());
        dto.setReportFormat(settings.getReportFormat());

        // Security settings
        dto.setTwoFactorEnabled(settings.getTwoFactorEnabled());
        dto.setSessionTimeout(settings.getSessionTimeout());
        dto.setLoginNotifications(settings.getLoginNotifications());

        // Advanced settings from JSON
        AdvancedSettings advancedSettings = getAdvancedSettings(settings);
        dto.setApiKey(advancedSettings.getApiKey());
        dto.setWebhookUrl(advancedSettings.getWebhookUrl());
        dto.setSlackIntegration(advancedSettings.getSlackIntegration());
        dto.setTeamsIntegration(advancedSettings.getTeamsIntegration());
        dto.setEmailIntegration(advancedSettings.getEmailIntegration());
        dto.setDebugMode(advancedSettings.getDebugMode());
        dto.setLogLevel(advancedSettings.getLogLevel());
        dto.setCacheEnabled(advancedSettings.getCacheEnabled());
        dto.setCacheTimeout(advancedSettings.getCacheTimeout());
        dto.setExperimentalFeatures(advancedSettings.getExperimentalFeatures());
        dto.setSmsNotifications(advancedSettings.getSmsNotifications());
        dto.setDesktopNotifications(advancedSettings.getDesktopNotifications());

        // Metadata
        dto.setCreatedAt(settings.getCreatedAt());
        dto.setUpdatedAt(settings.getUpdatedAt());
        dto.setVersion(settings.getVersion());

        return dto;
    }
}
