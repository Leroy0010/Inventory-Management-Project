# Web Security Configuration Guide

This document outlines the modern web security implementation for the Inventory Management Spring Boot application.

## 🔐 Security Features Implemented

### 1. **OAuth2 Authentication (Google)**

-   **Web Application Flow**: Proper OAuth2 authorization code flow for web apps
-   **Redirect URI**: Configurable via `GOOGLE_REDIRECT_URI` environment variable
-   **Scopes**: `email`, `profile`, `openid`
-   **Token Exchange**: Secure server-side token exchange
-   **User Info**: Fetched from Google's userinfo endpoint

### 2. **JWT Token Management**

-   **HTTP-Only Cookies**: JWT tokens stored in secure, HTTP-only cookies
-   **Refresh Tokens**: Automatic token rotation for enhanced security
-   **Token Validation**: Comprehensive JWT validation with proper error handling
-   **Expiration**: Configurable token expiration times

### 3. **CSRF Protection**

-   **CSRF Tokens**: Cookie-based CSRF token implementation
-   **Exemptions**: Proper exemptions for authentication endpoints
-   **Header Validation**: `X-XSRF-TOKEN` header validation

### 4. **CORS Configuration**

-   **Origin Patterns**: Support for localhost and production domains
-   **Credentials**: Proper credential handling for cross-origin requests
-   **Methods**: Allowed HTTP methods configuration
-   **Headers**: Comprehensive header support

### 5. **Security Headers**

-   **X-Content-Type-Options**: `nosniff` to prevent MIME type sniffing
-   **X-Frame-Options**: `DENY` to prevent clickjacking
-   **X-XSS-Protection**: `1; mode=block` for XSS protection
-   **Referrer-Policy**: `strict-origin-when-cross-origin`
-   **Content-Security-Policy**: Comprehensive CSP implementation
-   **HSTS**: HTTP Strict Transport Security for HTTPS

### 6. **Input Validation & Sanitization**

-   **Request Validation**: Comprehensive input validation
-   **Error Handling**: Secure error responses without information leakage
-   **Logging**: Security event logging without sensitive data exposure

## 🚀 OAuth2 Flow for Web Applications

### 1. **Frontend Initiation**

```javascript
// Get Google OAuth URL
const response = await fetch("/api/auth/google/url");
const { authUrl } = await response.json();

// Redirect to Google
window.location.href = authUrl;
```

### 2. **Google Authorization**

-   User is redirected to Google's OAuth consent screen
-   User grants permissions
-   Google redirects back to configured redirect URI with authorization code

### 3. **Backend Token Exchange**

-   Backend exchanges authorization code for access token
-   Fetches user information from Google
-   Validates user exists in application database
-   Generates JWT and refresh tokens
-   Sets secure HTTP-only cookies

### 4. **Authentication Response**

-   User information returned (without sensitive tokens)
-   JWT stored in HTTP-only cookie
-   Refresh token stored in separate HTTP-only cookie

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# JWT Configuration
JWT_SECRET=your_64_byte_base64_encoded_secret

# Frontend URL
FRONTEND_BASE_URL=http://localhost:5173
```

### Google Cloud Console Setup

1. **Create OAuth2 Credentials**:

    - Application type: Web application
    - Authorized redirect URIs: `http://localhost:5173/auth/callback`
    - Authorized JavaScript origins: `http://localhost:5173`

2. **Enable APIs**:
    - Google+ API (for user info)
    - OAuth2 API

## 🛡️ Security Best Practices Implemented

### 1. **Token Security**

-   ✅ JWT stored in HTTP-only cookies
-   ✅ Refresh token rotation
-   ✅ Secure token generation
-   ✅ Proper token validation

### 2. **Request Security**

-   ✅ CSRF protection
-   ✅ CORS configuration
-   ✅ Input validation
-   ✅ Rate limiting (via Spring Security)

### 3. **Response Security**

-   ✅ Security headers
-   ✅ Content Security Policy
-   ✅ Secure error responses
-   ✅ No sensitive data in responses

### 4. **Authentication Security**

-   ✅ OAuth2 best practices
-   ✅ Secure redirect handling
-   ✅ User validation
-   ✅ Session management

## 🔍 API Endpoints

### Authentication Endpoints

-   `POST /api/auth/login` - Username/password login
-   `POST /api/auth/google` - Google OAuth token exchange
-   `POST /api/auth/refresh` - Token refresh
-   `POST /api/auth/logout` - Logout
-   `GET /api/auth/google/url` - Get Google OAuth URL

### OAuth2 Endpoints (Spring Security)

-   `GET /oauth2/authorization/google` - Initiate Google OAuth
-   `GET /login/oauth2/code/google` - OAuth callback

## 🧪 Testing Security

### 1. **OAuth2 Flow Test**

```bash
# 1. Get OAuth URL
curl http://localhost:8080/api/auth/google/url

# 2. Test OAuth callback (after user authorization)
curl -X POST "http://localhost:8080/api/auth/google" \
  -d "code=AUTHORIZATION_CODE_FROM_GOOGLE"
```

### 2. **Security Headers Test**

```bash
curl -I http://localhost:8080/api/auth/google/url
```

### 3. **CSRF Protection Test**

```bash
# This should fail without CSRF token
curl -X POST http://localhost:8080/api/some-protected-endpoint
```

## 🚨 Security Considerations

### 1. **Production Deployment**

-   Use HTTPS in production
-   Set secure cookie flags
-   Configure proper CORS origins
-   Use strong JWT secrets
-   Enable HSTS

### 2. **Monitoring**

-   Monitor authentication failures
-   Log security events
-   Track token usage
-   Monitor for suspicious activity

### 3. **Regular Updates**

-   Keep dependencies updated
-   Rotate secrets regularly
-   Review security configurations
-   Update OAuth2 scopes as needed

## 🔧 Troubleshooting

### Common Issues

1. **OAuth2 Redirect Mismatch**

    - Ensure redirect URI matches Google Console configuration
    - Check environment variable `GOOGLE_REDIRECT_URI`

2. **CORS Errors**

    - Verify CORS configuration
    - Check allowed origins
    - Ensure credentials are properly handled

3. **CSRF Token Issues**

    - Ensure CSRF token is included in requests
    - Check cookie configuration
    - Verify exempted endpoints

4. **JWT Validation Errors**
    - Check JWT secret configuration
    - Verify token format
    - Check token expiration

### Debug Mode

Enable debug logging for security:

```yaml
logging:
    level:
        org.springframework.security: DEBUG
        com.leroy.inventorymanagementspringboot.security: DEBUG
```

## 📚 Additional Resources

-   [Spring Security OAuth2 Documentation](https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html)
-   [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
-   [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
-   [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
