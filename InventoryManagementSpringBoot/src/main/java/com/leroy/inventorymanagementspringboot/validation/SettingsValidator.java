package com.leroy.inventorymanagementspringboot.validation;

import com.leroy.inventorymanagementspringboot.dto.settings.UserSettingsDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SettingsValidator {

    private static final List<String> VALID_THEMES = List.of("light", "dark", "system");
    private static final List<String> VALID_LANGUAGES = List.of("en", "es", "fr", "de");
    private static final List<String> VALID_PROFILE_VISIBILITY = List.of("public", "department", "private");
    private static final List<String> VALID_DASHBOARD_LAYOUTS = List.of("compact", "comfortable", "spacious");
    private static final List<String> VALID_REPORT_FORMATS = List.of("pdf", "excel", "csv");
    private static final List<Integer> VALID_PAGE_SIZES = List.of(10, 25, 50, 100);
    private static final List<Integer> VALID_REFRESH_INTERVALS = List.of(30, 60, 120, 300, 600);
    private static final List<Integer> VALID_SESSION_TIMEOUTS = List.of(15, 30, 60, 120, 240);

    /**
     * Validate user settings
     */
    public List<String> validateUserSettings(UserSettingsDto settings) {
        List<String> errors = new ArrayList<>();

        // General Settings Validation
        if (settings.getTheme() != null && !VALID_THEMES.contains(settings.getTheme())) {
            errors.add("Invalid theme. Must be one of: " + VALID_THEMES);
        }

        if (settings.getLanguage() != null && !VALID_LANGUAGES.contains(settings.getLanguage())) {
            errors.add("Invalid language. Must be one of: " + VALID_LANGUAGES);
        }

        if (settings.getTimezone() != null && !isValidTimezone(settings.getTimezone())) {
            errors.add("Invalid timezone format");
        }

        // Privacy Settings Validation
        if (settings.getProfileVisibility() != null
                && !VALID_PROFILE_VISIBILITY.contains(settings.getProfileVisibility())) {
            errors.add("Invalid profile visibility. Must be one of: " + VALID_PROFILE_VISIBILITY);
        }

        // Application Settings Validation
        if (settings.getDashboardLayout() != null && !VALID_DASHBOARD_LAYOUTS.contains(settings.getDashboardLayout())) {
            errors.add("Invalid dashboard layout. Must be one of: " + VALID_DASHBOARD_LAYOUTS);
        }

        if (settings.getDefaultPageSize() != null && !VALID_PAGE_SIZES.contains(settings.getDefaultPageSize())) {
            errors.add("Invalid page size. Must be one of: " + VALID_PAGE_SIZES);
        }

        if (settings.getRefreshInterval() != null && !VALID_REFRESH_INTERVALS.contains(settings.getRefreshInterval())) {
            errors.add("Invalid refresh interval. Must be one of: " + VALID_REFRESH_INTERVALS);
        }

        if (settings.getReportFormat() != null && !VALID_REPORT_FORMATS.contains(settings.getReportFormat())) {
            errors.add("Invalid report format. Must be one of: " + VALID_REPORT_FORMATS);
        }

        // Security Settings Validation
        if (settings.getSessionTimeout() != null && !VALID_SESSION_TIMEOUTS.contains(settings.getSessionTimeout())) {
            errors.add("Invalid session timeout. Must be one of: " + VALID_SESSION_TIMEOUTS);
        }

        return errors;
    }

    /**
     * Validate settings category update
     */
    public List<String> validateCategorySettings(String category, Map<String, Object> settings) {
        List<String> errors = new ArrayList<>();

        switch (category.toLowerCase()) {
            case "general" -> validateGeneralSettings(settings, errors);
            case "notifications" -> validateNotificationSettings(settings, errors);
            case "privacy" -> validatePrivacySettings(settings, errors);
            case "application" -> validateApplicationSettings(settings, errors);
            case "security" -> validateSecuritySettings(settings, errors);
            case "advanced" -> validateAdvancedSettings(settings, errors);
            default -> errors.add("Unknown settings category: " + category);
        }

        return errors;
    }

    private void validateGeneralSettings(Map<String, Object> settings, List<String> errors) {
        if (settings.containsKey("theme") && !VALID_THEMES.contains(settings.get("theme"))) {
            errors.add("Invalid theme. Must be one of: " + VALID_THEMES);
        }
        if (settings.containsKey("language") && !VALID_LANGUAGES.contains(settings.get("language"))) {
            errors.add("Invalid language. Must be one of: " + VALID_LANGUAGES);
        }
        if (settings.containsKey("timezone") && !isValidTimezone(settings.get("timezone").toString())) {
            errors.add("Invalid timezone format");
        }
    }

    private void validateNotificationSettings(Map<String, Object> settings, List<String> errors) {
        // Validate boolean fields
        validateBooleanField(settings, "emailNotifications", errors);
        validateBooleanField(settings, "pushNotifications", errors);
        validateBooleanField(settings, "inAppNotifications", errors);
    }

    private void validatePrivacySettings(Map<String, Object> settings, List<String> errors) {
        if (settings.containsKey("profileVisibility")
                && !VALID_PROFILE_VISIBILITY.contains(settings.get("profileVisibility"))) {
            errors.add("Invalid profile visibility. Must be one of: " + VALID_PROFILE_VISIBILITY);
        }
        validateBooleanField(settings, "activityTracking", errors);
        validateBooleanField(settings, "marketingEmails", errors);
    }

    private void validateApplicationSettings(Map<String, Object> settings, List<String> errors) {
        if (settings.containsKey("dashboardLayout")
                && !VALID_DASHBOARD_LAYOUTS.contains(settings.get("dashboardLayout"))) {
            errors.add("Invalid dashboard layout. Must be one of: " + VALID_DASHBOARD_LAYOUTS);
        }
        if (settings.containsKey("defaultPageSize") && !VALID_PAGE_SIZES.contains(settings.get("defaultPageSize"))) {
            errors.add("Invalid page size. Must be one of: " + VALID_PAGE_SIZES);
        }
        if (settings.containsKey("refreshInterval")
                && !VALID_REFRESH_INTERVALS.contains(settings.get("refreshInterval"))) {
            errors.add("Invalid refresh interval. Must be one of: " + VALID_REFRESH_INTERVALS);
        }
        if (settings.containsKey("reportFormat") && !VALID_REPORT_FORMATS.contains(settings.get("reportFormat"))) {
            errors.add("Invalid report format. Must be one of: " + VALID_REPORT_FORMATS);
        }
    }

    private void validateSecuritySettings(Map<String, Object> settings, List<String> errors) {
        if (settings.containsKey("sessionTimeout")
                && !VALID_SESSION_TIMEOUTS.contains(settings.get("sessionTimeout"))) {
            errors.add("Invalid session timeout. Must be one of: " + VALID_SESSION_TIMEOUTS);
        }
        validateBooleanField(settings, "twoFactorEnabled", errors);
        validateBooleanField(settings, "loginNotifications", errors);
    }

    private void validateAdvancedSettings(Map<String, Object> settings, List<String> errors) {
        // Validate API key format if provided
        if (settings.containsKey("apiKey") && settings.get("apiKey") != null) {
            String apiKey = settings.get("apiKey").toString();
            if (apiKey.length() < 10) {
                errors.add("API key must be at least 10 characters long");
            }
        }

        // Validate webhook URL format if provided
        if (settings.containsKey("webhookUrl") && settings.get("webhookUrl") != null) {
            String webhookUrl = settings.get("webhookUrl").toString();
            if (!isValidUrl(webhookUrl)) {
                errors.add("Invalid webhook URL format");
            }
        }

        // Validate log level
        if (settings.containsKey("logLevel")) {
            List<String> validLogLevels = List.of("error", "warn", "info", "debug");
            if (!validLogLevels.contains(settings.get("logLevel"))) {
                errors.add("Invalid log level. Must be one of: " + validLogLevels);
            }
        }

        // Validate cache timeout
        if (settings.containsKey("cacheTimeout")) {
            Object cacheTimeout = settings.get("cacheTimeout");
            if (cacheTimeout instanceof Number) {
                int timeout = ((Number) cacheTimeout).intValue();
                if (timeout < 1 || timeout > 1440) { // 1 minute to 24 hours
                    errors.add("Cache timeout must be between 1 and 1440 minutes");
                }
            }
        }
    }

    private void validateBooleanField(Map<String, Object> settings, String fieldName, List<String> errors) {
        if (settings.containsKey(fieldName) && !(settings.get(fieldName) instanceof Boolean)) {
            errors.add(fieldName + " must be a boolean value");
        }
    }

    private boolean isValidTimezone(String timezone) {
        try {
            java.util.TimeZone.getTimeZone(timezone);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isValidUrl(String url) {
        try {
            new java.net.URL(url);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
