# User Settings API Security Documentation

## Overview

This document outlines the security implementation for the User Settings API, including role-based access control, authentication requirements, and security best practices.

## Security Architecture

### Authentication

-   **Required**: All endpoints require valid authentication
-   **Method**: JWT token-based authentication
-   **Context**: User ID extracted from authentication principal

### Authorization

-   **Method**: Method-level security using `@PreAuthorize` annotations
-   **Roles**: ADMIN, STOREKEEPER, STAFF
-   **Scope**: Users can only access their own settings unless they have elevated privileges

## Role-Based Access Control

### Role Hierarchy

```
ADMIN > STOREKEEPER > STAFF
```

### Permission Matrix

| Endpoint                      | Method | ADMIN | STOREKEEPER | STAFF | Description                    |
| ----------------------------- | ------ | ----- | ----------- | ----- | ------------------------------ |
| `/api/settings`               | GET    | ✅    | ✅          | ✅    | Get own settings               |
| `/api/settings/user/{userId}` | GET    | ✅    | ✅          | ❌    | Get any user's settings        |
| `/api/settings`               | POST   | ✅    | ✅          | ✅    | Create/update own settings     |
| `/api/settings/{category}`    | PATCH  | ✅    | ✅          | ✅    | Update own settings category   |
| `/api/settings/reset`         | POST   | ✅    | ✅          | ✅    | Reset own settings to defaults |
| `/api/settings`               | DELETE | ✅    | ✅          | ✅    | Delete own settings            |
| `/api/settings/exists`        | GET    | ✅    | ✅          | ✅    | Check if own settings exist    |
| `/api/settings/stats`         | GET    | ✅    | ❌          | ❌    | Get system-wide statistics     |
| `/api/settings/bulk`          | POST   | ✅    | ❌          | ❌    | Bulk update settings           |
| `/api/settings/export`        | GET    | ✅    | ✅          | ✅    | Export own settings            |
| `/api/settings/import`        | POST   | ✅    | ✅          | ✅    | Import settings                |

## Security Features

### 1. Input Validation

-   **Bean Validation**: `@Valid` annotations on request bodies
-   **Custom Validation**: `SettingsValidator` for business rules
-   **Type Safety**: Strong typing with DTOs
-   **Sanitization**: Input sanitization in validation layer

### 2. Error Handling

-   **Consistent Responses**: Standardized error response format
-   **Security Logging**: Comprehensive logging without exposing sensitive data
-   **Graceful Degradation**: Proper HTTP status codes
-   **Exception Mapping**: Custom exception handlers

### 3. Data Protection

-   **User Isolation**: Users can only access their own data
-   **Role Verification**: Server-side role checking
-   **Audit Logging**: Security events logged
-   **Data Validation**: All inputs validated before processing

## Security Implementation Details

### Controller Security

```java
@RestController
@RequestMapping("/api/settings")
@PreAuthorize("hasRole('USER')") // Base security for all endpoints
public class UserSettingsController {

    // Admin-only endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSettingsStatistics() {
        // Implementation
    }

    // Admin and Storekeeper endpoints
    @PreAuthorize("hasRole('ADMIN') or hasRole('STOREKEEPER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserSettingsDto> getUserSettingsById(@PathVariable Integer userId) {
        // Implementation
    }
}
```

### Validation Security

```java
@Component
public class SettingsValidator {

    public List<String> validateUserSettings(UserSettingsDto settings) {
        // Validate all settings fields
        // Check for malicious input
        // Ensure data integrity
    }

    public List<String> validateCategorySettings(String category, Map<String, Object> settings) {
        // Category-specific validation
        // Role-based field validation
        // Business rule enforcement
    }
}
```

### Exception Handling

```java
@RestControllerAdvice
public class SettingsExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException() {
        // Return 403 Forbidden
        // Log security event
        // No sensitive data exposure
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException() {
        // Return 401 Unauthorized
        // Log authentication failure
        // Clear error messages
    }
}
```

## Security Best Practices

### 1. Authentication

-   ✅ JWT token validation
-   ✅ Token expiration handling
-   ✅ Secure token storage
-   ✅ Authentication context validation

### 2. Authorization

-   ✅ Method-level security
-   ✅ Role-based access control
-   ✅ User data isolation
-   ✅ Privilege escalation prevention

### 3. Input Validation

-   ✅ Server-side validation
-   ✅ Type safety
-   ✅ Business rule enforcement
-   ✅ Malicious input detection

### 4. Error Handling

-   ✅ Consistent error responses
-   ✅ No sensitive data exposure
-   ✅ Comprehensive logging
-   ✅ Graceful error handling

### 5. Data Protection

-   ✅ User data isolation
-   ✅ Secure data transmission
-   ✅ Audit logging
-   ✅ Data integrity checks

## Security Testing

### Test Categories

1. **Authentication Tests**

    - Valid token acceptance
    - Invalid token rejection
    - Expired token handling

2. **Authorization Tests**

    - Role-based access control
    - User data isolation
    - Privilege escalation prevention

3. **Input Validation Tests**

    - Valid input acceptance
    - Invalid input rejection
    - Malicious input detection

4. **Error Handling Tests**
    - Consistent error responses
    - No sensitive data exposure
    - Proper HTTP status codes

### Test Examples

```java
@Test
@WithMockUser(roles = "STAFF")
public void testStaffCannotAccessOtherUserSettings() {
    // Test that STAFF cannot access other user's settings
    ResponseEntity<UserSettingsDto> response =
        restTemplate.getForEntity("/api/settings/user/123", UserSettingsDto.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
}

@Test
@WithMockUser(roles = "ADMIN")
public void testAdminCanAccessAnyUserSettings() {
    // Test that ADMIN can access any user's settings
    ResponseEntity<UserSettingsDto> response =
        restTemplate.getForEntity("/api/settings/user/123", UserSettingsDto.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
}
```

## Security Monitoring

### Logging

-   **Authentication Events**: Login attempts, token validation
-   **Authorization Events**: Access attempts, permission checks
-   **Security Violations**: Unauthorized access attempts
-   **Data Access**: Settings read/write operations

### Metrics

-   **Failed Authentication**: Count of failed login attempts
-   **Access Denied**: Count of authorization failures
-   **Validation Errors**: Count of input validation failures
-   **Security Exceptions**: Count of security-related exceptions

### Alerts

-   **Multiple Failed Attempts**: Alert on repeated authentication failures
-   **Unauthorized Access**: Alert on access denied events
-   **Suspicious Activity**: Alert on unusual access patterns
-   **System Errors**: Alert on security-related system errors

## Compliance

### Data Protection

-   **User Privacy**: Users can only access their own data
-   **Data Minimization**: Only necessary data is collected and stored
-   **Data Retention**: Settings data retained according to policy
-   **Data Deletion**: Secure deletion of user settings

### Audit Requirements

-   **Access Logging**: All settings access logged
-   **Change Tracking**: Settings changes tracked
-   **User Actions**: User actions logged
-   **System Events**: Security events logged

## Security Recommendations

### 1. Regular Security Reviews

-   Review access control policies
-   Audit user permissions
-   Check for privilege escalation
-   Validate input validation rules

### 2. Security Updates

-   Keep dependencies updated
-   Apply security patches
-   Monitor security advisories
-   Test security fixes

### 3. User Education

-   Security awareness training
-   Best practices documentation
-   Incident response procedures
-   Regular security updates

### 4. Monitoring and Alerting

-   Real-time security monitoring
-   Automated alerting
-   Incident response procedures
-   Regular security reports

## Conclusion

The User Settings API implements comprehensive security measures including:

-   Role-based access control
-   Input validation and sanitization
-   Secure error handling
-   Audit logging
-   Data protection

These measures ensure that user settings are protected while maintaining usability and functionality.
