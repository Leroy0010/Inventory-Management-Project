# Refresh Token and CSRF Protection Implementation

## Overview
This implementation adds refresh token functionality and CSRF protection to the Spring Boot authentication system using HTTP-only cookies for enhanced security.

## Key Features Implemented

### 1. Refresh Token System
- **RefreshToken Entity**: Stores refresh tokens in the database with expiration and revocation tracking
- **RefreshTokenRepository**: Database operations for refresh token management
- **RefreshTokenService**: Business logic for token lifecycle management including:
  - Token creation and validation
  - Token rotation for security
  - Automatic cleanup of expired tokens
  - User token limit management

### 2. HTTP-Only Cookie Security
- **CookieUtil**: Helper class for secure cookie management with:
  - HTTP-only, Secure, and SameSite flags
  - Configurable cookie settings
  - Automatic cookie clearing for logout

### 3. CSRF Protection
- **SecurityConfig Updates**: 
  - Enabled CSRF protection with cookie-based token storage
  - Configured CSRF token repository
  - Excluded authentication endpoints from CSRF validation

### 4. Enhanced Authentication Flow
- **JwtAuthenticationFilter**: Updated to read tokens from cookies (with header fallback)
- **AuthController**: Modified to use HTTP-only cookies instead of response body tokens
- **New Endpoints**:
  - `POST /api/auth/refresh` - Refresh JWT using refresh token
  - `POST /api/auth/logout` - Logout and clear all cookies

## Configuration

### Application Properties
```yaml
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000  # 24 hours
  refresh:
    expiration: 604800000  # 7 days
    max-tokens-per-user: 5
  cookie:
    name: jwt
    refresh:
      name: refreshToken
    domain: ""
    path: /
    secure: true
    http-only: true
    same-site: Strict
```

## Security Benefits

1. **HTTP-Only Cookies**: Prevents XSS attacks by making tokens inaccessible to JavaScript
2. **Secure Flag**: Ensures cookies are only sent over HTTPS
3. **SameSite Protection**: Prevents CSRF attacks
4. **Token Rotation**: Refresh tokens are rotated on each use for enhanced security
5. **Automatic Cleanup**: Expired tokens are automatically removed
6. **Token Limits**: Prevents token abuse by limiting tokens per user

## Database Changes

A new `refresh_tokens` table has been added with the following structure:
- `id` (Primary Key)
- `token` (Unique UUID)
- `user_id` (Foreign Key to users table)
- `expires_at` (Token expiration timestamp)
- `is_revoked` (Revocation status)
- `created_at` / `updated_at` (Audit timestamps)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password (returns user info, sets cookies)
- `POST /api/auth/refresh` - Refresh JWT token using refresh token cookie
- `POST /api/auth/logout` - Logout and clear all authentication cookies

### Password Reset (unchanged)
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

## Frontend Integration

The frontend should:
1. **No longer store JWT tokens** - they're now in HTTP-only cookies
2. **Include CSRF token** in requests (available in XSRF-TOKEN cookie)
3. **Handle token refresh** automatically when JWT expires
4. **Clear cookies on logout**

## Migration

The database migration is automatically applied via Liquibase changelog `db.changelog-005-refresh-tokens.yaml`.

## Testing

To test the implementation:

1. **Login**: `POST /api/auth/login` with credentials
   - Should return user info without JWT in response body
   - Should set `jwt` and `refreshToken` HTTP-only cookies

2. **Access Protected Resource**: Any authenticated endpoint
   - Should work automatically with cookies

3. **Refresh Token**: `POST /api/auth/refresh`
   - Should return new user info and set new cookies

4. **Logout**: `POST /api/auth/logout`
   - Should clear all authentication cookies

## Security Considerations

- All cookies are HTTP-only and Secure
- CSRF protection is enabled with cookie-based tokens
- Refresh tokens are rotated on each use
- Automatic cleanup prevents token accumulation
- Token limits prevent abuse
