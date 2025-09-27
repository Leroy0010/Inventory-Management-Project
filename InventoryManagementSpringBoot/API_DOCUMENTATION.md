# User Settings API Documentation

## Overview

The User Settings API provides endpoints for managing user preferences and application settings. It uses a hybrid approach with core settings stored as database columns and advanced settings stored as JSONB.

## Base URL

```
/api/settings
```

## Authentication

All endpoints require authentication. The user ID is extracted from the authentication context.

## Core Settings (Database Columns)

-   **General**: theme, language, timezone, auto_save
-   **Notifications**: email_notifications, push_notifications, in_app_notifications
-   **Privacy**: profile_visibility, activity_tracking, marketing_emails
-   **Application**: dashboard_layout, default_page_size, auto_refresh, refresh_interval, report_format
-   **Security**: two_factor_enabled, session_timeout, login_notifications

## Advanced Settings (JSONB)

All extended features are stored in the `advanced_settings` JSONB column for flexibility.

---

## Endpoints

### 1. Get Current User Settings

**GET** `/api/settings`

Get the current user's settings.

**Response:**

```json
{
    "id": 1,
    "userId": 123,
    "userEmail": "user@example.com",
    "userName": "John Doe",
    "theme": "system",
    "language": "en",
    "timezone": "America/New_York",
    "autoSave": true,
    "emailNotifications": true,
    "pushNotifications": true,
    "inAppNotifications": true,
    "profileVisibility": "department",
    "activityTracking": true,
    "marketingEmails": false,
    "dashboardLayout": "comfortable",
    "defaultPageSize": 25,
    "autoRefresh": true,
    "refreshInterval": 30,
    "reportFormat": "pdf",
    "twoFactorEnabled": false,
    "sessionTimeout": 60,
    "loginNotifications": true,
    "apiKey": "user-api-key",
    "webhookUrl": "https://webhook.url",
    "slackIntegration": false,
    "teamsIntegration": false,
    "emailIntegration": true,
    "debugMode": false,
    "logLevel": "info",
    "cacheEnabled": true,
    "cacheTimeout": 15,
    "experimentalFeatures": false,
    "smsNotifications": false,
    "desktopNotifications": false,
    "createdAt": "2025-01-24T10:00:00",
    "updatedAt": "2025-01-24T10:00:00",
    "version": "1.0.0"
}
```

**Status Codes:**

-   `200 OK` - Settings retrieved successfully
-   `404 Not Found` - User has no settings
-   `500 Internal Server Error` - Server error

---

### 2. Get User Settings by ID (Admin)

**GET** `/api/settings/user/{userId}`

Get settings for a specific user (admin only).

**Parameters:**

-   `userId` (path) - The user ID

**Response:** Same as GET `/api/settings`

---

### 3. Save User Settings

**POST** `/api/settings`

Create or update the current user's settings.

**Request Body:**

```json
{
    "theme": "dark",
    "language": "en",
    "timezone": "America/New_York",
    "autoSave": true,
    "emailNotifications": true,
    "pushNotifications": false,
    "inAppNotifications": true,
    "profileVisibility": "department",
    "activityTracking": true,
    "marketingEmails": false,
    "dashboardLayout": "comfortable",
    "defaultPageSize": 25,
    "autoRefresh": true,
    "refreshInterval": 60,
    "reportFormat": "pdf",
    "twoFactorEnabled": false,
    "sessionTimeout": 60,
    "loginNotifications": true
}
```

**Response:** Same as GET `/api/settings`

**Status Codes:**

-   `200 OK` - Settings saved successfully
-   `400 Bad Request` - Invalid input data
-   `500 Internal Server Error` - Server error

---

### 4. Update Settings Category

**PATCH** `/api/settings/{category}`

Update a specific category of settings.

**Parameters:**

-   `category` (path) - Settings category (general, notifications, privacy, application, security, advanced)

**Request Body Examples:**

**General Settings:**

```json
{
    "theme": "dark",
    "language": "es",
    "timezone": "Europe/Madrid",
    "autoSave": false
}
```

**Notification Settings:**

```json
{
    "emailNotifications": true,
    "pushNotifications": false,
    "inAppNotifications": true
}
```

**Advanced Settings:**

```json
{
    "apiKey": "new-api-key",
    "webhookUrl": "https://new-webhook.url",
    "slackIntegration": true,
    "debugMode": true,
    "logLevel": "debug",
    "cacheEnabled": true,
    "cacheTimeout": 30,
    "experimentalFeatures": true
}
```

**Response:** Same as GET `/api/settings`

**Status Codes:**

-   `200 OK` - Settings updated successfully
-   `400 Bad Request` - Invalid category or data
-   `500 Internal Server Error` - Server error

---

### 5. Reset to Defaults

**POST** `/api/settings/reset`

Reset user settings to default values.

**Response:** Same as GET `/api/settings` (with default values)

**Status Codes:**

-   `200 OK` - Settings reset successfully
-   `500 Internal Server Error` - Server error

---

### 6. Delete User Settings

**DELETE** `/api/settings`

Delete the current user's settings.

**Response:** No content

**Status Codes:**

-   `204 No Content` - Settings deleted successfully
-   `500 Internal Server Error` - Server error

---

### 7. Check if User Has Settings

**GET** `/api/settings/exists`

Check if the current user has settings configured.

**Response:**

```json
{
    "exists": true
}
```

**Status Codes:**

-   `200 OK` - Check completed successfully
-   `500 Internal Server Error` - Server error

---

### 8. Get Settings Statistics (Admin)

**GET** `/api/settings/stats`

Get statistics about user settings (admin only).

**Response:**

```json
{
    "totalUsers": 150,
    "themes": {
        "light": 45,
        "dark": 60,
        "system": 45
    },
    "languages": {
        "en": 120,
        "es": 20,
        "fr": 10
    },
    "notifications": {
        "emailEnabled": 140,
        "pushEnabled": 90,
        "inAppEnabled": 150
    }
}
```

**Status Codes:**

-   `200 OK` - Statistics retrieved successfully
-   `500 Internal Server Error` - Server error

---

### 9. Export User Settings

**GET** `/api/settings/export`

Export the current user's settings.

**Response:**

```json
{
    "settings": {
        // Full settings object as in GET /api/settings
    }
}
```

**Status Codes:**

-   `200 OK` - Settings exported successfully
-   `404 Not Found` - User has no settings
-   `500 Internal Server Error` - Server error

---

### 10. Import User Settings

**POST** `/api/settings/import`

Import settings for the current user.

**Request Body:**

```json
{
    "settings": {
        // Full settings object
    }
}
```

**Response:** Same as GET `/api/settings`

**Status Codes:**

-   `200 OK` - Settings imported successfully
-   `400 Bad Request` - Invalid import data
-   `500 Internal Server Error` - Server error

---

## Validation Rules

### General Settings

-   `theme`: Must be one of: "light", "dark", "system"
-   `language`: Must be one of: "en", "es", "fr", "de"
-   `timezone`: Must be a valid timezone identifier
-   `autoSave`: Boolean

### Notification Settings

-   `emailNotifications`: Boolean
-   `pushNotifications`: Boolean
-   `inAppNotifications`: Boolean

### Privacy Settings

-   `profileVisibility`: Must be one of: "public", "department", "private"
-   `activityTracking`: Boolean
-   `marketingEmails`: Boolean

### Application Settings

-   `dashboardLayout`: Must be one of: "compact", "comfortable", "spacious"
-   `defaultPageSize`: Must be one of: 10, 25, 50, 100
-   `refreshInterval`: Must be one of: 30, 60, 120, 300, 600 (seconds)
-   `reportFormat`: Must be one of: "pdf", "excel", "csv"

### Security Settings

-   `twoFactorEnabled`: Boolean
-   `sessionTimeout`: Must be one of: 15, 30, 60, 120, 240 (minutes)
-   `loginNotifications`: Boolean

### Advanced Settings

-   `apiKey`: String (minimum 10 characters)
-   `webhookUrl`: Valid URL format
-   `logLevel`: Must be one of: "error", "warn", "info", "debug"
-   `cacheTimeout`: Integer (1-1440 minutes)

---

## Error Responses

### 400 Bad Request

```json
{
    "error": "Validation failed",
    "message": "Invalid theme. Must be one of: [light, dark, system]",
    "timestamp": "2025-01-24T10:00:00Z"
}
```

### 404 Not Found

```json
{
    "error": "Not Found",
    "message": "User settings not found",
    "timestamp": "2025-01-24T10:00:00Z"
}
```

### 500 Internal Server Error

```json
{
    "error": "Internal Server Error",
    "message": "An unexpected error occurred",
    "timestamp": "2025-01-24T10:00:00Z"
}
```

---

## Usage Examples

### Frontend Integration

```javascript
// Get user settings
const response = await fetch("/api/settings", {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
});
const settings = await response.json();

// Update theme
await fetch("/api/settings/general", {
    method: "PATCH",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        theme: "dark",
        language: "en",
    }),
});

// Update advanced settings
await fetch("/api/settings/advanced", {
    method: "PATCH",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        debugMode: true,
        logLevel: "debug",
        experimentalFeatures: true,
    }),
});
```

---

## Database Schema

```sql
CREATE TABLE user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Core Settings (15 fields)
    theme VARCHAR(20) DEFAULT 'system',
    language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50),
    auto_save BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    in_app_notifications BOOLEAN DEFAULT true,
    profile_visibility VARCHAR(20) DEFAULT 'department',
    activity_tracking BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    dashboard_layout VARCHAR(20) DEFAULT 'comfortable',
    default_page_size INTEGER DEFAULT 25,
    auto_refresh BOOLEAN DEFAULT true,
    refresh_interval INTEGER DEFAULT 30,
    report_format VARCHAR(10) DEFAULT 'pdf',
    two_factor_enabled BOOLEAN DEFAULT false,
    session_timeout INTEGER DEFAULT 60,
    login_notifications BOOLEAN DEFAULT true,

    -- Advanced Settings (JSONB)
    advanced_settings JSONB,

    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR(10) DEFAULT '1.0.0'
);
```
