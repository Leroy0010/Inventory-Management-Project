# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   **User Settings Management System (Complete Backend Implementation)**

    -   **Core Settings**: 15 essential settings stored as database columns for optimal performance
    -   **Advanced Settings**: Extended settings stored as JSONB for flexibility and scalability
    -   Settings categories: General, Notifications, Privacy, Application, Security, Advanced
    -   UserSettings JPA entity with hybrid approach (columns + JSONB)
    -   UserSettingsRepository with advanced query methods
    -   UserSettingsService with JSON handling for advanced settings
    -   UserSettingsDto for API communication
    -   AdvancedSettings DTO for JSON-based settings management
    -   UserSettingsController with comprehensive REST API endpoints
    -   SettingsValidator with input validation and constraints
    -   Settings persistence with automatic timestamps and versioning
    -   **Streamlined Design**: Reduced from 50+ fields to 15 core fields + JSONB for advanced features
    -   **Complete API**: 10 REST endpoints for full CRUD operations and advanced features

-   **Frontend Settings Page**

    -   Modern, responsive settings interface with tabbed navigation
    -   Real-time save status indicators and unsaved changes tracking
    -   Permission-based access control for different settings categories
    -   Comprehensive form validation and error handling
    -   Local storage integration with API fallback
    -   Mobile-responsive design with proper breakpoints

-   **Settings Categories Implemented**

    -   **General Settings**: Theme, language, timezone, date/time formats, behavior preferences
    -   **Notification Settings**: Email, push, in-app notifications with frequency controls and quiet hours
    -   **Privacy Settings**: Profile visibility, data sharing controls, communication preferences
    -   **Application Settings**: Dashboard layout, page sizes, auto-refresh, report formats
    -   **Security Settings**: Two-factor authentication, session management, password policies, API access
    -   **Advanced Settings**: API configuration, integrations, debug mode, performance settings

-   **Backend Infrastructure**
    -   UserSettings entity with comprehensive field mapping
    -   Repository layer with specialized query methods
    -   DTO layer for clean API communication
    -   Database schema for settings persistence
    -   Audit fields (created_at, updated_at, version)

### Technical Details

#### Database Schema

-   New `user_settings` table with 50+ columns
-   One-to-one relationship with `users` table
-   Proper indexing and constraints
-   Default values for all settings
-   Audit trail with timestamps

#### Frontend Architecture

-   TypeScript types for all settings categories
-   Reusable settings components
-   Custom hooks for settings management
-   Form validation with Zod integration
-   State management with React hooks
-   Local storage persistence

#### API Design

-   RESTful endpoints for settings CRUD operations
-   Permission-based access control
-   Comprehensive DTO mapping
-   Error handling and validation
-   Version tracking for settings changes

### Security Features

-   Role-based access control for settings categories
-   Secure API key storage and management
-   Two-factor authentication settings
-   Session timeout configuration
-   Privacy controls and data sharing preferences

### Performance Optimizations

-   Lazy loading for settings entity relationships
-   Efficient query methods for common operations
-   Caching configuration options
-   Optimized database queries with proper indexing

### User Experience

-   Intuitive tabbed interface matching existing design patterns
-   Real-time feedback for all user actions
-   Comprehensive help text and descriptions
-   Mobile-responsive design
-   Accessibility features and keyboard navigation

### Developer Experience

-   Comprehensive TypeScript type definitions
-   Reusable component architecture
-   Clear separation of concerns
-   Extensive documentation and comments
-   Consistent coding patterns

## [Previous Versions]

### [1.0.0] - 2025-01-24

-   Initial release with basic inventory management functionality
-   User authentication and authorization
-   Department, staff, and inventory management
-   Request management system
-   Basic reporting functionality
-   Notification system

---

## Migration Notes

### Database Migration

To add the new settings functionality, run the following SQL migration:

```sql
-- Create user_settings table (Streamlined Hybrid Model)
CREATE TABLE user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- ===== CORE SETTINGS (15 essential fields) =====

    -- General Settings (4 fields)
    theme VARCHAR(20) DEFAULT 'system',
    language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50),
    auto_save BOOLEAN DEFAULT true,

    -- Notification Settings (3 fields)
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    in_app_notifications BOOLEAN DEFAULT true,

    -- Privacy Settings (3 fields)
    profile_visibility VARCHAR(20) DEFAULT 'department',
    activity_tracking BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,

    -- Application Settings (5 fields)
    dashboard_layout VARCHAR(20) DEFAULT 'comfortable',
    default_page_size INTEGER DEFAULT 25,
    auto_refresh BOOLEAN DEFAULT true,
    refresh_interval INTEGER DEFAULT 30,
    report_format VARCHAR(10) DEFAULT 'pdf',

    -- Security Settings (3 fields)
    two_factor_enabled BOOLEAN DEFAULT false,
    session_timeout INTEGER DEFAULT 60,
    login_notifications BOOLEAN DEFAULT true,

    -- ===== ADVANCED SETTINGS (stored as JSONB for flexibility) =====
    advanced_settings JSONB,

    -- ===== METADATA =====
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR(10) DEFAULT '1.0.0'
);

-- Create indexes for performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_settings_theme ON user_settings(theme);
CREATE INDEX idx_user_settings_language ON user_settings(language);
CREATE INDEX idx_user_settings_email_notifications ON user_settings(email_notifications);
CREATE INDEX idx_user_settings_two_factor_enabled ON user_settings(two_factor_enabled);
CREATE INDEX idx_user_settings_advanced_settings ON user_settings USING GIN (advanced_settings);

-- Example of advanced_settings JSON structure:
-- {
--   "apiKey": "user-api-key",
--   "webhookUrl": "https://webhook.url",
--   "slackIntegration": false,
--   "teamsIntegration": false,
--   "emailIntegration": true,
--   "debugMode": false,
--   "logLevel": "info",
--   "cacheEnabled": true,
--   "cacheTimeout": 15,
--   "experimentalFeatures": false,
--   "quietHoursEnabled": false,
--   "quietHoursStart": "22:00",
--   "quietHoursEnd": "08:00",
--   "smsNotifications": false,
--   "desktopNotifications": false,
--   "accentColor": "#3b82f6",
--   "fontFamily": "Inter",
--   "fontSize": 14,
--   "animationsEnabled": true,
--   "autoBackup": false,
--   "backupFrequency": "weekly",
--   "backupLocation": "cloud",
--   "showDebugInfo": false,
--   "enableLogging": true,
--   "logRetentionDays": "30"
-- }
```

### Frontend Dependencies

No new dependencies required. Uses existing UI components and patterns.

### Configuration

No additional configuration required. Settings are automatically initialized with default values for new users.

---

## Breaking Changes

None in this release. All changes are additive and backward compatible.

## Deprecations

None in this release.

## Security Considerations

-   API keys are stored securely in the database
-   Sensitive settings are properly validated and sanitized
-   User permissions are enforced at both frontend and backend levels
-   All settings changes are audited with timestamps

## Performance Impact

-   Minimal performance impact due to efficient database design
-   Settings are loaded on-demand to reduce initial page load time
-   Caching options available for frequently accessed settings
-   Optimized queries with proper indexing

## Future Enhancements

-   Settings import/export functionality
-   Bulk settings management for administrators
-   Settings templates and presets
-   Advanced analytics on user preferences
-   Settings synchronization across devices
-   Real-time settings updates via WebSocket
